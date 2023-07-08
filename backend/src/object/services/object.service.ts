import { Delete, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UpsertObjectDto,
  GetSimpleObjectForUserResultDto,
  GetSimpleObjectsForUserDto,
  SimpleObjectForUserResultDto,
  GetObjectForUserDto,
  GetObjectForUserResultDto,
  DeleteObjectDto,
  DeleteObjectResultDto,
} from '../dtos/object.dto';
import { ObjectType } from '@prisma/client';
@Injectable()
export class ObjectService {
  constructor(private prismaService: PrismaService) {}

  logger = new Logger('ObjectService');

  async createObject(upsertObjectDto: UpsertObjectDto) {
    await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.findFirst({
        where: {
          username: upsertObjectDto.username,
        },
        select: {
          id: true,
        },
      });

      const client = await prisma.client.findFirst({
        where: {
          idUser: user.id,
        },
        select: {
          id: true,
        },
      });

      if (upsertObjectDto.id) {
        await prisma.object.update({
          where: {
            id: upsertObjectDto.id,
          },
          data: {
            type: upsertObjectDto.type as ObjectType,
            roomCount: upsertObjectDto.upsertChartObjectDto.rooms.length,
            area: upsertObjectDto.upsertChartObjectDto.rooms.reduce(
              (acc, room) => acc + room.width * room.height,
              0,
            ),
            address: {
              update: {
                address: upsertObjectDto.address,
                city: upsertObjectDto.city,
                country: upsertObjectDto.country,
              },
            },
          },
        });
        await prisma.room.deleteMany({
          where: {
            chart: {
              idObject: upsertObjectDto.id,
            },
          },
        });
        await prisma.door.deleteMany({
          where: {
            chart: {
              idObject: upsertObjectDto.id,
            },
          },
        });
        await prisma.chart.delete({
          where: {
            idObject: upsertObjectDto.id,
          },
        });
        const chart = await prisma.chart.create({
          data: {
            idObject: upsertObjectDto.id,
          },
        });
        for (const room of upsertObjectDto.upsertChartObjectDto.rooms) {
          await prisma.room.create({
            data: {
              width: room.width,
              height: room.height,
              cordX: room.cordX,
              cordY: room.cordY,
              chartId: chart.id,
            },
          });
        }
        for (const door of upsertObjectDto.upsertChartObjectDto.doors) {
          await prisma.door.create({
            data: {
              width: door.width,
              height: door.height,
              cordX: door.cordX,
              cordY: door.cordY,
              chartId: chart.id,
            },
          });
        }
        this.logger.log('Object updated successfully');
      } else {
        const location = await prisma.location.create({
          data: {
            address: upsertObjectDto.address,
            city: upsertObjectDto.city,
            country: upsertObjectDto.country,
          },
        });
        const object = await prisma.object.create({
          data: {
            type: ObjectType[upsertObjectDto.type],
            roomCount: upsertObjectDto.upsertChartObjectDto.rooms.length,
            area: upsertObjectDto.upsertChartObjectDto.rooms.reduce(
              (acc, room) => acc + room.width * room.height,
              0,
            ),
            idClient: client.id,
            addressId: location.id,
          },
        });
        const chart = await prisma.chart.create({
          data: {
            idObject: object.id,
          },
        });
        for (const room of upsertObjectDto.upsertChartObjectDto.rooms) {
          await prisma.room.create({
            data: {
              width: room.width,
              height: room.height,
              cordX: room.cordX,
              cordY: room.cordY,
              chartId: chart.id,
            },
          });
        }
        for (const door of upsertObjectDto.upsertChartObjectDto.doors) {
          await prisma.door.create({
            data: {
              width: door.width,
              height: door.height,
              cordX: door.cordX,
              cordY: door.cordY,
              chartId: chart.id,
            },
          });
        }
      }
      this.logger.log('Object created successfully');
    });
  }

  async getSimpleObjectsForUser(
    getObjectsForUserDto: GetSimpleObjectsForUserDto,
  ): Promise<GetSimpleObjectForUserResultDto> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: getObjectsForUserDto.username,
      },
      select: {
        id: true,
      },
    });
    const client = await this.prismaService.client.findFirst({
      where: {
        idUser: user.id,
      },
      select: {
        id: true,
      },
    });
    const objects = await this.prismaService.object.findMany({
      where: {
        idClient: client.id,
        ...(getObjectsForUserDto.requestless
          ? {
              jobRequests: {
                none: {
                  status: {
                    in: ['pending_no_offer', 'pending_with_offer'],
                  },
                },
              },
              jobs: {
                none: {
                  state: 'inProgress',
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        type: true,
        roomCount: true,
        area: true,
        address: {
          select: {
            address: true,
            city: true,
            country: true,
          },
        },
      },
    });
    const objectDtos: SimpleObjectForUserResultDto[] = [];
    objects.forEach((object) => {
      objectDtos.push({
        id: object.id,
        type: object.type,
        roomCount: object.roomCount,
        area: object.area,
        address: object.address.address,
        city: object.address.city,
        country: object.address.country,
      });
    });
    this.logger.log(`Objects for user ${JSON.stringify(objectDtos)}`);

    return { objects: objectDtos };
  }

  async getObjectForUser(
    getObjectForUserDto: GetObjectForUserDto,
  ): Promise<GetObjectForUserResultDto> {
    const object = await this.prismaService.object.findUnique({
      where: {
        id: getObjectForUserDto.id,
      },
      select: {
        id: true,
        type: true,
        roomCount: true,
        area: true,
        address: {
          select: {
            address: true,
            city: true,
            country: true,
          },
        },
        chart: {
          select: {
            rooms: {
              select: {
                id: true,
                cordX: true,
                cordY: true,
                width: true,
                height: true,
              },
            },
            doors: {
              select: {
                id: true,
                cordX: true,
                cordY: true,
                width: true,
                height: true,
              },
            },
          },
        },
      },
    });
    const objectDto: GetObjectForUserResultDto = {
      type: object.type,
      address: object.address.address,
      city: object.address.city,
      country: object.address.country,
      rooms: object.chart.rooms.map((room) => {
        return {
          id: room.id,
          cordX: room.cordX,
          cordY: room.cordY,
          width: room.width,
          height: room.height,
        };
      }),
      doors: object.chart.doors.map((door) => {
        return {
          id: door.id,
          cordX: door.cordX,
          cordY: door.cordY,
          width: door.width,
          height: door.height,
        };
      }),
    };
    this.logger.log(`Object for user ${JSON.stringify(objectDto)}`);

    return objectDto;
  }

  async deleteObjectForUser(
    deleteObjectDto: DeleteObjectDto,
  ): Promise<DeleteObjectResultDto> {
    const object = await this.prismaService.object.findUnique({
      where: {
        id: deleteObjectDto.id,
      },
      select: {
        id: true,
        chart: {
          select: {
            id: true,
          },
        },
      },
    });
    await this.prismaService.room.deleteMany({
      where: {
        chartId: object.chart.id,
      },
    });
    await this.prismaService.door.deleteMany({
      where: {
        chartId: object.chart.id,
      },
    });
    await this.prismaService.chart.delete({
      where: {
        id: object.chart.id,
      },
    });
    await this.prismaService.object.delete({
      where: {
        id: deleteObjectDto.id,
      },
    });
    return { message: 'Object deleted successfully' };
  }

  async seed() {
    const client = await this.prismaService.client.findFirst({});
    const user = await this.prismaService.user.findUnique({
      where: {
        id: client.idUser,
      },
      select: {
        username: true,
      },
    });
    const createObjectDto: UpsertObjectDto = {
      type: 'flat',
      address: 'str. Mihai Viteazu, nr. 1',
      city: 'Iasi',
      country: 'Romania',
      username: user.username,
      upsertChartObjectDto: {
        rooms: [
          {
            cordX: 10,
            cordY: 10,
            width: 100,
            height: 100,
          },
        ],
        doors: [
          {
            cordX: 10,
            cordY: 20,
            width: 10,
            height: 10,
          },
        ],
      },
    };
    await this.createObject(createObjectDto);
    const createObjectDto2: UpsertObjectDto = {
      type: 'flat',
      address: 'Aleea Mihai Viteazu, nr. 1',
      city: 'Arad',
      country: 'Romania',
      username: user.username,
      upsertChartObjectDto: {
        rooms: [
          {
            cordX: 10,
            cordY: 10,
            width: 100,
            height: 100,
          },
        ],
        doors: [
          {
            cordX: 10,
            cordY: 20,
            width: 10,
            height: 10,
          },
        ],
      },
    };
    await this.createObject(createObjectDto2);
  }
}

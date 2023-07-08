import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteUserDto,
  GetAgencyUserInfoDto,
  GetAgencyUserInfoListResultDto,
  GetClientUserInfoDto,
  GetClientUserInfoListResultDto,
  GetClientUserInfoResultDto,
  UpdateAgencyUserInfoDto,
  UpdateClientUserInfoDto,
} from '../dtos/profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}
  logger = new Logger('ClientService');

  async getClient(
    getUserInfoDto: GetClientUserInfoDto,
  ): Promise<GetClientUserInfoResultDto> {
    this.logger.log(`Getting client ${getUserInfoDto.username}`);
    const result = await this.prismaService.user.findUnique({
      where: {
        username: getUserInfoDto.username,
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        image: true,
        client: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    this.logger.debug(`Result: ${JSON.stringify(result)}`);

    const getUserInfoResultDto: GetClientUserInfoResultDto = {
      username: result.username,
      name: result.client.name,
      surname: result.client.surname,
      email: result.email,
      phone: result.phone,
      image: result.image,
    };
    return getUserInfoResultDto;
  }

  async getAgency(getAgencyUserInfoDto: GetAgencyUserInfoDto) {
    this.logger.log(`Getting agency ${getAgencyUserInfoDto.username}`);
    const result = await this.prismaService.user.findUnique({
      where: {
        username: getAgencyUserInfoDto.username,
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        image: true,
        agency: {
          select: {
            name: true,
            location: {
              select: {
                country: true,
                city: true,
                address: true,
              },
            },
          },
        },
      },
    });

    this.logger.debug(`Result: ${JSON.stringify(result)}`);

    const getAgencyUserInfoResultDto = {
      name: result.agency.name,
      country: result.agency.location.country,
      city: result.agency.location.city,
      address: result.agency.location.address,
      email: result.email,
      phone: result.phone,
      image: result.image,
    };
    return getAgencyUserInfoResultDto;
  }

  async updateClient(updateClientUserInfoDto: UpdateClientUserInfoDto) {
    this.logger.log(`Updating client ${updateClientUserInfoDto.username}`);
    await this.prismaService.user.update({
      where: {
        username: updateClientUserInfoDto.username,
      },
      data: {
        phone: updateClientUserInfoDto.phone,
        email: updateClientUserInfoDto.email,
        image: updateClientUserInfoDto.image,
        client: {
          update: {
            name: updateClientUserInfoDto.name,
            surname: updateClientUserInfoDto.surname,
          },
        },
      },
    });
  }

  async updateAgency(updateAgencyUserInfoDto: UpdateAgencyUserInfoDto) {
    this.logger.log(`Updating agency ${updateAgencyUserInfoDto.username}`);
    await this.prismaService.user.update({
      where: {
        username: updateAgencyUserInfoDto.username,
      },
      data: {
        phone: updateAgencyUserInfoDto.phone,
        email: updateAgencyUserInfoDto.email,
        image: updateAgencyUserInfoDto.image,
        agency: {
          update: {
            name: updateAgencyUserInfoDto.name,
            location: {
              update: {
                country: updateAgencyUserInfoDto.country,
                city: updateAgencyUserInfoDto.city,
                address: updateAgencyUserInfoDto.address,
              },
            },
          },
        },
      },
    });
  }

  async getAllClientProfiles(): Promise<GetClientUserInfoListResultDto> {
    this.logger.log(`Getting all client profiles`);
    const result = await this.prismaService.user.findMany({
      where: {
        type: 'client',
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        image: true,
        client: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    });

    this.logger.debug(`Result: ${JSON.stringify(result)}`);

    const getClientUserInfoListResultDto: GetClientUserInfoListResultDto = {
      clients: result.map((client) => {
        return {
          username: client.username,
          name: client.client.name,
          surname: client.client.surname,
          email: client.email,
          phone: client.phone,
          image: client.image,
        };
      }),
    };
    return getClientUserInfoListResultDto;
  }

  async getAllAgencyProfiles(): Promise<GetAgencyUserInfoListResultDto> {
    this.logger.log(`Getting all agency profiles`);
    const result = await this.prismaService.user.findMany({
      where: {
        type: 'agency',
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        image: true,
        agency: {
          select: {
            name: true,
            location: {
              select: {
                country: true,
                city: true,
                address: true,
              },
            },
          },
        },
      },
    });

    this.logger.debug(`Result: ${JSON.stringify(result)}`);

    const getAgencyUserInfoListResultDto: GetAgencyUserInfoListResultDto = {
      agencies: result.map((agency) => {
        return {
          username: agency.username,
          name: agency.agency.name,
          country: agency.agency.location.country,
          city: agency.agency.location.city,
          address: agency.agency.location.address,
          email: agency.email,
          phone: agency.phone,
          image: agency.image,
        };
      }),
    };
    return getAgencyUserInfoListResultDto;
  }
  async deleteUser(deleteUserDto: DeleteUserDto): Promise<any> {
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.user.delete({
        where: {
          username: deleteUserDto.username,
        },
      });
    });
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateJobRequestDto,
  GetJobRequestListResponseDto,
  GetJobRequestsDto,
  GetJobRequestResponseDto,
  GetJobRequestsWithUserAndObjectResultJobRequestDto,
  GetJobRequestsWithUserAndObjectResultDto,
  GetJobRequestsWithUserAndObjectResultUserInfoDto,
  GetJobRequestsWithUserAndObjectResultObjectInfoRoomDto,
  GetJobRequestsWithUserAndObjectResultObjectInfoDoorDto,
  MakeOfferForJobRequestDto,
  AcceptJobRequestDto,
  RejectJobRequestDto,
} from '../dtos/jobs-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  logger = new Logger('JobsService');
  async createJobRequest(createJobRequestDto: CreateJobRequestDto) {
    const client = await this.prisma.client.findFirst({
      where: {
        objects: {
          some: {
            id: createJobRequestDto.objectId,
          },
        },
      },
    });
    const jobRequest = await this.prisma.jobRequest.create({
      data: {
        startDate: new Date(createJobRequestDto.startDate),
        endDate: new Date(createJobRequestDto.endDate),
        idAgency: createJobRequestDto.agencyId,
        idClient: client.id,
        idObject: createJobRequestDto.objectId,
      },
    });
    this.logger.log(`Created job request with id ${jobRequest.id}`);
  }

  async seedCreateJobRequest() {
    const client = await this.prisma.client.findFirst({
      include: {
        objects: true,
      },
    });
    const agency = await this.prisma.agency.findFirst();

    const jobRequest = await this.prisma.jobRequest.create({
      data: {
        startDate: new Date('2021-06-01'),
        endDate: new Date('2021-06-30'),
        idAgency: agency.id,
        idClient: client.id,
        idObject: client.objects[0].id,
      },
    });
    this.logger.log(`Created job request with id ${jobRequest.id}`);
  }

  async getJobRequestOfferForClientList(
    getJobRequestsDto: GetJobRequestsDto,
  ): Promise<GetJobRequestListResponseDto> {
    const jobRequests = await this.prisma.jobRequest.findMany({
      where: {
        // status: {
        //   not: {
        //     in: ['accepted'],
        //   },
        // },
        client: {
          user: {
            username: getJobRequestsDto.username,
          },
        },
      },
      include: {
        agency: true,
        object: {
          include: {
            address: true,
          },
        },
      },
    });

    const jobRequestList: GetJobRequestResponseDto[] = [];
    jobRequests.forEach((jobRequest) => {
      jobRequestList.push({
        id: jobRequest.id,
        startDate: jobRequest.startDate,
        endDate: jobRequest.endDate,
        agencyName: jobRequest.agency.name,
        objectAddress: jobRequest.object.address.address,
        status: jobRequest.status,
        offer: jobRequest.offer,
      });
    });
    return { jobRequests: jobRequestList };
  }

  async getJobRequestWithNoPendingOffersForAgencyList(
    getJobRequestsDto: GetJobRequestsDto,
  ): Promise<GetJobRequestsWithUserAndObjectResultDto> {
    const jobRequests = await this.prisma.jobRequest.findMany({
      where: {
        agency: {
          user: {
            username: getJobRequestsDto.username,
          },
        },
        status: 'pending_no_offer',
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        agency: true,
        object: {
          include: {
            address: true,
            chart: {
              include: {
                rooms: true,
                doors: true,
              },
            },
          },
        },
      },
    });
    const jobRequestsDto: GetJobRequestsWithUserAndObjectResultJobRequestDto[] =
      [];
    jobRequests.forEach((jobRequest) => {
      const userInfo: GetJobRequestsWithUserAndObjectResultUserInfoDto = {
        name: jobRequest.client.name,
        surname: jobRequest.client.surname,
        email: jobRequest.client.user.email,
        phone: jobRequest.client.user.phone,
      };
      const rooms: GetJobRequestsWithUserAndObjectResultObjectInfoRoomDto[] =
        [];
      const doors: GetJobRequestsWithUserAndObjectResultObjectInfoDoorDto[] =
        [];
      jobRequest.object.chart.rooms.forEach((room) => {
        rooms.push({
          cordX: room.cordX,
          cordY: room.cordY,
          width: room.width,
          height: room.height,
        });
      });
      jobRequest.object.chart.doors.forEach((door) => {
        doors.push({
          cordX: door.cordX,
          cordY: door.cordY,
          width: door.width,
          height: door.height,
        });
      });

      jobRequestsDto.push({
        id: jobRequest.id,
        startDate: jobRequest.startDate,
        endDate: jobRequest.endDate,
        status: jobRequest.status,
        userInfo,
        offer: jobRequest.offer,
        objectInfo: {
          id: jobRequest.object.id,
          address: jobRequest.object.address.address,
          city: jobRequest.object.address.city,
          country: jobRequest.object.address.country,
          area: jobRequest.object.area,
          type: jobRequest.object.type,
          rooms,
          doors,
        },
      });
    });
    return { jobRequests: jobRequestsDto };
  }

  async makeJobRequestOffer(
    makeOfferForJobRequestDto: MakeOfferForJobRequestDto,
  ) {
    await this.prisma.jobRequest.update({
      where: {
        id: makeOfferForJobRequestDto.jobRequestId,
      },
      data: {
        offer: makeOfferForJobRequestDto.offer,
        status: 'pending_with_offer',
      },
    });
  }

  async seedMakeJobRequestOffer() {
    const agency = await this.prisma.agency.findFirst({
      include: {
        user: true,
      },
    });
    const res: GetJobRequestsWithUserAndObjectResultDto =
      await this.getJobRequestWithNoPendingOffersForAgencyList({
        username: agency.user.username,
      });
    if (res.jobRequests.length === 0) {
      throw new NotFoundException('No job requests found');
    }
    const jobRequest = res.jobRequests[0];
    await this.makeJobRequestOffer({
      jobRequestId: jobRequest.id,
      offer: 1000,
    });
  }

  async acceptJobRequestOffer(acceptJobRequestDto: AcceptJobRequestDto) {
    await this.prisma.jobRequest.update({
      where: {
        id: acceptJobRequestDto.jobRequestId,
      },
      data: {
        status: 'accepted',
      },
    });

    const jobOffer = await this.prisma.jobRequest.findFirst({
      where: {
        id: acceptJobRequestDto.jobRequestId,
      },
      include: {
        object: {
          include: {
            chart: {
              include: {
                rooms: true,
              },
            },
          },
        },
      },
    });
    await this.prisma.job.create({
      data: {
        startDate: jobOffer.startDate,
        endDate: jobOffer.endDate,
        idAgency: jobOffer.idAgency,
        idClient: jobOffer.idClient,
        idObject: jobOffer.idObject,
        price: jobOffer.offer,
      },
    });

    jobOffer.object.chart.rooms.forEach((room) => {
      this.prisma.roomProgress.create({
        data: {
          idJob: jobOffer.id,
          idRoom: room.id,
        },
      });
    });
  }

  async seedAcceptJobRequestOffer() {
    const client = await this.prisma.client.findFirst({
      include: {
        user: true,
      },
    });
    const res: GetJobRequestListResponseDto =
      await this.getJobRequestOfferForClientList({
        username: client.user.username,
      });
    if (res.jobRequests.length === 0) {
      throw new NotFoundException('No job requests found');
    }
    const jobRequest = res.jobRequests[0];
    await this.acceptJobRequestOffer({
      jobRequestId: jobRequest.id,
    });
  }

  async rejectJobRequestOffer(rejectJobRequestDto: RejectJobRequestDto) {
    await this.prisma.jobRequest.update({
      where: {
        id: rejectJobRequestDto.jobRequestId,
      },
      data: {
        status: 'rejected',
      },
    });
  }

  async seed() {
    await this.seedCreateJobRequest();
    await this.seedMakeJobRequestOffer();
    await this.seedAcceptJobRequestOffer();
  }
}

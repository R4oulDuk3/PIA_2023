import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssignWorkerDto,
  GetActiveJobDto,
  GetActiveJobResultDoorDto,
  GetActiveJobResultDto,
  GetActiveJobResultRoomDto,
  GetActiveJobResultRoomProgressDto,
  GetActiveJobResultRoomProgressWorkerDto,
  GetSimpleJobListDto,
  GetSimpleJobListResultDto,
  GetSimpleJobListResultJobDto,
  StartWorkOnRoomDto,
  FinishWorkOnRoomDto,
  PayAndCommentJobDto,
} from '../dtos/jobs-active.dto';
@Injectable()
export class JobsActiveService {
  constructor(private prisma: PrismaService) {}
  logger = new Logger('JobsActiveService');

  async getSimpleJobList(
    getSimpleJobListDto: GetSimpleJobListDto,
  ): Promise<GetSimpleJobListResultDto> {
    const jobsDto: GetSimpleJobListResultJobDto[] = [];
    const jobs = await this.prisma.job.findMany({
      where: {
        [getSimpleJobListDto.userType]: {
          user: {
            username: getSimpleJobListDto.username,
          },
        },
      },
      include: {
        agency: true,
        client: true,
        object: {
          include: {
            address: true,
          },
        },
      },
    });
    jobs.forEach((job) => {
      jobsDto.push({
        id: job.id,
        startDate: job.startDate,
        endDate: job.endDate,
        price: job.price,
        agencyName: job.agency.name,
        objectAddress: job.object.address.address,
        state: job.state,
      });
    });
    return { jobs: jobsDto };
  }

  async getActiveJob(
    getActiveJobDto: GetActiveJobDto,
  ): Promise<GetActiveJobResultDto> {
    const job = await this.prisma.job.findFirst({
      where: {
        id: getActiveJobDto.jobId,
      },
      include: {
        agency: true,
        client: true,
        roomProgress: true,
        jobAssigments: {
          include: {
            worker: true,
          },
        },
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

    const roomsDto: GetActiveJobResultRoomDto[] = [];
    const roomProgressDto: GetActiveJobResultRoomProgressDto[] = [];
    const assignedWorkersDto: GetActiveJobResultRoomProgressWorkerDto[] = [];
    const doorsDto: GetActiveJobResultDoorDto[] = [];

    job.object.chart.rooms.forEach((room) => {
      roomsDto.push({
        id: room.id,
        cordX: room.cordX,
        cordY: room.cordY,
        height: room.height,
        width: room.width,
      });
    });

    job.object.chart.doors.forEach((door) => {
      doorsDto.push({
        cordX: door.cordX,
        cordY: door.cordY,
        height: door.height,
        width: door.width,
      });
    });

    job.roomProgress.forEach((roomProgress) => {
      roomProgressDto.push({
        roomId: roomProgress.idRoom,
        state: roomProgress.state,
      });
    });

    job.jobAssigments.forEach((jobAssigment) => {
      assignedWorkersDto.push({
        id: jobAssigment.worker.id,
        name: jobAssigment.worker.name,
        surname: jobAssigment.worker.surname,
        email: jobAssigment.worker.email,
        specialization: jobAssigment.worker.specialization,
      });
    });

    return {
      id: job.id,
      startDate: job.startDate,
      endDate: job.endDate,
      price: job.price,
      agencyName: job.agency.name,
      objectAddress: job.object.address.address,
      state: job.state,
      rooms: roomsDto,
      doors: doorsDto,
      roomProgress: roomProgressDto,
      assignedWorkers: assignedWorkersDto,
    };
  }

  async assignWorkerToJob(assignWorkerDto: AssignWorkerDto) {
    this.logger.log(assignWorkerDto);
    // TODO: Validation check if workers already assigned to job
    const job = await this.prisma.job.findFirst({
      where: {
        id: assignWorkerDto.jobId,
      },
    });
    if (!job) {
      throw new BadRequestException('Job not found');
    }

    await this.prisma.jobAssigment.create({
      data: {
        job: {
          connect: {
            id: job.id,
          },
        },
        worker: {
          connect: {
            id: assignWorkerDto.workerId,
          },
        },
      },
    });
  }

  async startProgressOnRoom(startWorkOnRoomDto: StartWorkOnRoomDto) {
    this.logger.log(startWorkOnRoomDto);
    const roomProgress = await this.prisma.roomProgress.findFirst({
      where: {
        idJob: startWorkOnRoomDto.jobId,
        idRoom: startWorkOnRoomDto.roomId,
      },
    });

    if (roomProgress) {
      await this.prisma.roomProgress.update({
        where: {
          id: roomProgress.id,
        },
        data: {
          state: 'inConstruction',
        },
      });
    } else {
      await this.prisma.roomProgress.create({
        data: {
          idJob: startWorkOnRoomDto.jobId,
          idRoom: startWorkOnRoomDto.roomId,
          state: 'inConstruction',
        },
      });
    }
    // TODO: Validation check if room already in progress
  }

  async finishProgressOnRoom(finishWorkOnRoomDto: FinishWorkOnRoomDto) {
    this.logger.log(finishWorkOnRoomDto);
    const roomProgress = await this.prisma.roomProgress.findFirst({
      where: {
        idJob: finishWorkOnRoomDto.jobId,
        idRoom: finishWorkOnRoomDto.roomId,
      },
    });
    if (!roomProgress) {
      throw new BadRequestException('Room not found');
    }
    await this.prisma.roomProgress.update({
      where: {
        id: roomProgress.id,
      },
      data: {
        state: 'finished',
      },
    });
    const job = await this.prisma.job.findFirst({
      where: {
        id: finishWorkOnRoomDto.jobId,
        roomProgress: {
          every: {
            state: 'finished',
          },
        },
      },
    });
    if (job) {
      await this.prisma.job.update({
        where: {
          id: job.id,
        },
        data: {
          state: 'finished',
        },
      });
    }
  }

  async payAndCommentJob(payAndCommentJobDto: PayAndCommentJobDto) {
    this.logger.log(payAndCommentJobDto);
    const job = await this.prisma.job.update({
      where: {
        id: payAndCommentJobDto.jobId,
      },
      data: {
        state: 'paid',
      },
    });
    if (!job) {
      throw new BadRequestException('Job not found');
    }
    if (payAndCommentJobDto.comment)
      await this.prisma.comment.create({
        data: {
          idAgency: job.idAgency,
          idClient: job.idClient,
          text: payAndCommentJobDto.comment,
          rating: payAndCommentJobDto.rating,
        },
      });
  }
}

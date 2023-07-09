import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApproveWorkerIncreaseRequestDto,
  CreateWorkerIncreaseRequestDto,
  DeleteWorkerDto,
  GetAgencyWorkersDto,
  GetAgencyWorkersResultDto,
  GetAllPendingWorkerIncreaseRequestsResultDto,
  GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto,
  GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto,
  GetWorkerIncreaseRequestsForAgencyDto,
  GetWorkerIncreaseRequestsForAgencyResultDto,
  RejectWorkerIncreaseRequestDto,
  UpsertWorkerDto,
} from '../dtos/workers.dto';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}
  logger = new Logger('WorkersService');

  async getWorkersForAgency(
    getAgencyWorkersDto: GetAgencyWorkersDto,
    unassigned = false,
  ): Promise<GetAgencyWorkersResultDto> {
    const agency = await this.prisma.agency.findFirst({
      where: {
        user: {
          username: getAgencyWorkersDto.username,
        },
      },
    });

    const workers = await this.prisma.worker.findMany({
      where: {
        agency: {
          id: agency.id,
        },
        ...(unassigned
          ? {
              jobAssgiments: {
                none: {
                  job: {
                    state: 'inProgress',
                  },
                },
              },
            }
          : {}),
      },
    });

    const workersResult: GetAgencyWorkersResultDto = {
      workers: workers.map((worker) => {
        return {
          id: worker.id,
          name: worker.name,
          surname: worker.surname,
          email: worker.email,
          specialization: worker.specialization,
        };
      }),
      currentWorkerCount: agency.currentWorkerCount,
      maxWorkerCount: agency.maxWorkerCount,
    };
    return workersResult;
  }

  async createWorkerIncreaseRequest(
    createWorkerIncreaseRequestDto: CreateWorkerIncreaseRequestDto,
  ) {
    const agency = await this.prisma.agency.findFirst({
      where: {
        user: {
          username: createWorkerIncreaseRequestDto.username,
        },
      },
    });

    const workerIncreaseRequest =
      await this.prisma.workerMaxCountIncreaseRequest.create({
        data: {
          idAgency: agency.id,
          newMaxWorkerCount: createWorkerIncreaseRequestDto.maxWorkerCount,
        },
      });
    this.logger.log(
      `Created worker increase request with id ${workerIncreaseRequest.id}`,
    );
  }

  async seedCreateWorkerIncreaseRequests() {
    const allAgencies = await this.prisma.agency.findMany({
      include: {
        user: true,
      },
    });
    for (const agency of allAgencies) {
      await this.createWorkerIncreaseRequest({
        username: agency.user.username,
        maxWorkerCount: Math.floor(Math.random() * 10) + 1,
      });
    }
  }

  async getAllPendingWorkerIncreaseRequests(): Promise<GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto> {
    this.logger.log(`Getting all pending worker increase requests`);
    const requests = await this.prisma.workerMaxCountIncreaseRequest.findMany({
      where: {
        status: 'pending',
      },
      include: {
        agency: true,
      },
    });

    return {
      requests: requests.map((request) => {
        return {
          id: request.id,
          agencyId: request.agency.id,
          agencyName: request.agency.name,
          newMaxWorkerCount: request.newMaxWorkerCount,
          currentWorkerCount: request.agency.currentWorkerCount,
          status: request.status,
        };
      }),
    };
  }

  async getAllWorkerIncreaseRequestsForAgency(
    getWorkerIncreaseRequestsForAgencyDto: GetWorkerIncreaseRequestsForAgencyDto,
  ): Promise<GetWorkerIncreaseRequestsForAgencyResultDto> {
    this.logger.log(
      `Getting all pending worker increase requests for agency with username ${getWorkerIncreaseRequestsForAgencyDto.username}`,
    );
    const requests = await this.prisma.workerMaxCountIncreaseRequest.findMany({
      where: {
        agency: {
          user: {
            username: getWorkerIncreaseRequestsForAgencyDto.username,
          },
        },
      },
    });

    return {
      requests: requests.map((request) => {
        return {
          id: request.id,
          newMaxWorkerCount: request.newMaxWorkerCount,
          status: request.status,
        };
      }),
    };
  }

  async approveWorkerIncreaseRequest(
    approveWorkerIncreaseRequestDto: ApproveWorkerIncreaseRequestDto,
  ) {
    const request = await this.prisma.workerMaxCountIncreaseRequest.findFirst({
      where: {
        id: approveWorkerIncreaseRequestDto.id,
      },
    });

    const agency = await this.prisma.agency.findFirst({
      where: {
        workerMaxCountIncreaseRequests: {
          some: {
            id: request.id,
          },
        },
      },
    });

    await this.prisma.agency.update({
      where: {
        id: agency.id,
      },
      data: {
        maxWorkerCount: request.newMaxWorkerCount,
      },
    });

    await this.prisma.workerMaxCountIncreaseRequest.update({
      where: {
        id: request.id,
      },
      data: {
        status: 'accepted',
      },
    });
  }

  async seedApproveAllWorkerIncreaseRequests() {
    const allRequests =
      await this.prisma.workerMaxCountIncreaseRequest.findMany({
        where: {
          status: 'pending',
        },
      });
    for (const request of allRequests) {
      await this.approveWorkerIncreaseRequest({
        id: request.id,
      });
    }
  }

  async rejectWorkerIncreaseRequest(
    RejectWorkerIncreaseRequestDto: RejectWorkerIncreaseRequestDto,
  ) {
    const request = await this.prisma.workerMaxCountIncreaseRequest.findFirst({
      where: {
        id: RejectWorkerIncreaseRequestDto.id,
      },
    });

    await this.prisma.workerMaxCountIncreaseRequest.update({
      where: {
        id: request.id,
      },
      data: {
        status: 'rejected',
      },
    });
  }

  async upsertWorker(upsertWorkerDto: UpsertWorkerDto) {
    if (upsertWorkerDto.id) {
      await this.prisma.worker.update({
        where: {
          id: upsertWorkerDto.id,
        },
        data: {
          name: upsertWorkerDto.name,
          surname: upsertWorkerDto.surname,
          email: upsertWorkerDto.email,
          specialization: upsertWorkerDto.specialization,
        },
      });
    } else {
      const agency = await this.prisma.agency.findFirst({
        where: {
          user: {
            username: upsertWorkerDto.agencyUsername,
          },
        },
      });

      await this.prisma.worker.create({
        data: {
          name: upsertWorkerDto.name,
          surname: upsertWorkerDto.surname,
          email: upsertWorkerDto.email,
          specialization: upsertWorkerDto.specialization,
          idAgency: agency.id,
        },
      });
      await this.prisma.agency.update({
        where: {
          id: agency.id,
        },
        data: {
          currentWorkerCount: {
            increment: 1,
          },
        },
      });
    }
  }

  async seedCreateAWorkerForEveryAgency() {
    const allAgencies = await this.prisma.agency.findMany({
      include: {
        user: true,
      },
    });
    for (const agency of allAgencies) {
      await this.upsertWorker({
        agencyUsername: agency.user.username,
        name: `Worker ${Math.floor(Math.random() * 100) + 1}`,
        surname: 'Doe',
        email: `worker${Math.floor(Math.random() * 100) + 1}@gmail.com`,
        specialization: ['plumber', 'electrician', 'carpenter'][
          Math.floor(Math.random() * 3)
        ],
      });
    }
  }

  async deleteWorker(deleteWorkerDto: DeleteWorkerDto) {
    // Check if worker has any room RoomProgressWorker
    const roomProgressWorkers = await this.prisma.jobAssigment.findMany({
      where: {
        idWorker: deleteWorkerDto.id,
      },
    });
    if (roomProgressWorkers.length > 0) {
      throw new BadRequestException(
        'Worker cannot be deleted because he has room progress',
      );
    }
    // Get agency the worker belongs to
    const agency = await this.prisma.agency.findFirst({
      where: {
        workers: {
          some: {
            id: deleteWorkerDto.id,
          },
        },
      },
    });

    // Delete worker
    await this.prisma.worker.delete({
      where: {
        id: deleteWorkerDto.id,
      },
    });

    // Decrement currentWorkerCount
    await this.prisma.agency.update({
      where: {
        id: agency.id,
      },
      data: {
        currentWorkerCount: {
          decrement: 1,
        },
      },
    });
  }
  async seed() {
    await this.seedCreateWorkerIncreaseRequests();
    await this.seedApproveAllWorkerIncreaseRequests();
    await this.seedCreateAWorkerForEveryAgency();
  }
}

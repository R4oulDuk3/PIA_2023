import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ObjectService } from 'src/object/services/object.service';
import { JobsService } from 'src/jobs/services/jobs-request.service';
import { WorkersService } from 'src/workers/services/workers.service';
@Injectable()
export class SeederService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private objectService: ObjectService,
    private workerService: WorkersService,
    private jobsRequestService: JobsService,
  ) {}

  async clearTables() {
    console.log('Clearing tables...');
    await this.prisma.jobRequest.deleteMany({});
    await this.prisma.jobAssigment.deleteMany({});
    await this.prisma.roomProgress.deleteMany({});
    await this.prisma.job.deleteMany({});
    await this.prisma.worker.deleteMany({});
    await this.prisma.chart.deleteMany({});
    await this.prisma.object.deleteMany({});

    await this.prisma.workerMaxCountIncreaseRequest.deleteMany({});
    await this.prisma.agency.deleteMany({});
    await this.prisma.client.deleteMany({});
    await this.prisma.registrationRequest.deleteMany({});
    await this.prisma.user.deleteMany({});
    await this.prisma.object.deleteMany({});

    console.log('Tables cleared');
  }

  async seed() {
    try {
      console.log('Seeding...');
      await this.clearTables();
      await this.authService.seed();
      await this.objectService.seed();
      await this.jobsRequestService.seed();
      await this.workerService.seed();
      console.log('Seeding completed');
    } catch (error) {
      console.log(error);
    }
  }
}

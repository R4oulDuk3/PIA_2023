import { Module } from '@nestjs/common';
import { JobsService } from './services/jobs-request.service';
import { JobsRequestController } from './controllers/jobs-request.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JobsActiveController } from './controllers/jobs-active.controller';
import { JobsActiveService } from './services/jobs-active.service';
@Module({
  imports: [PrismaModule],
  controllers: [JobsRequestController, JobsActiveController],
  providers: [JobsService, JobsActiveService],
  exports: [JobsService, JobsActiveService],
})
export class JobsModule {}

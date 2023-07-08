import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { JobsActiveService } from '../services/jobs-active.service';
import {
  AssignWorkerDto,
  FinishWorkOnRoomDto,
  PayAndCommentJobDto,
  StartWorkOnRoomDto,
} from '../dtos/jobs-active.dto';

@Controller('jobs/active')
export class JobsActiveController {
  constructor(private jobsActiveService: JobsActiveService) {}
  logger = new Logger('JobsActiveController');

  @Get('list/:username/:userType')
  getSimpleJobList(
    @Param('username') username: string,
    @Param('userType') userType: string,
  ) {
    return this.jobsActiveService.getSimpleJobList({ username, userType });
  }

  @Get(':id')
  getActiveJob(@Param('id') jobId: string) {
    return this.jobsActiveService.getActiveJob({ jobId: parseInt(jobId) });
  }

  @Post('assign')
  assignWorkers(@Body() assignWorkerDto: AssignWorkerDto) {
    this.logger.log(`assignWorkers: ${JSON.stringify(assignWorkerDto)}`);
    return this.jobsActiveService.assignWorkerToJob(assignWorkerDto);
  }

  @Post('start')
  startWorkOnRoom(@Body() startWorkOnRoomDto: StartWorkOnRoomDto) {
    return this.jobsActiveService.startProgressOnRoom(startWorkOnRoomDto);
  }

  @Post('finish')
  finishWorkOnRoom(@Body() finishWorkOnRoomDto: FinishWorkOnRoomDto) {
    return this.jobsActiveService.finishProgressOnRoom(finishWorkOnRoomDto);
  }

  @Post('pay')
  payAndCommentJob(@Body() finishWorkOnRoomDto: PayAndCommentJobDto) {
    return this.jobsActiveService.payAndCommentJob(finishWorkOnRoomDto);
  }
}

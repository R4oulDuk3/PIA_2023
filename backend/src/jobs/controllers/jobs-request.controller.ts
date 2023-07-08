import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JobsService } from '../services/jobs-request.service';
import {
  AcceptJobRequestDto,
  CreateJobRequestDto,
  MakeOfferForJobRequestDto,
  RejectJobRequestDto,
} from '../dtos/jobs-request.dto';

@Controller('jobs/request')
export class JobsRequestController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('')
  createJobRequest(@Body() createJobRequestDto: CreateJobRequestDto) {
    return this.jobsService.createJobRequest(createJobRequestDto);
  }

  @Get('client/list/:username')
  getJobRequests(@Param('username') username: string) {
    return this.jobsService.getJobRequestOfferForClientList({ username });
  }

  @Get('agency/list/:username')
  getJobRequestsForAgency(@Param('username') username: string) {
    return this.jobsService.getJobRequestWithNoPendingOffersForAgencyList({
      username,
    });
  }

  @Post('offer')
  makeJobRequestOffer(
    @Body() makeOfferForJobRequestDto: MakeOfferForJobRequestDto,
  ) {
    return this.jobsService.makeJobRequestOffer(makeOfferForJobRequestDto);
  }

  @Post('accept')
  acceptJobRequestOffer(@Body() acceptJobRequestDto: AcceptJobRequestDto) {
    return this.jobsService.acceptJobRequestOffer(acceptJobRequestDto);
  }

  @Post('reject')
  rejectJobRequestOffer(@Body() rejectJobRequestDto: RejectJobRequestDto) {
    return this.jobsService.rejectJobRequestOffer(rejectJobRequestDto);
  }
}

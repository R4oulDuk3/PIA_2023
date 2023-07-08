import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { WorkersService } from '../services/workers.service';
import {
  ApproveWorkerIncreaseRequestDto,
  CreateWorkerIncreaseRequestDto,
  RejectWorkerIncreaseRequestDto,
  UpsertWorkerDto,
} from '../dtos/workers.dto';

@Controller('workers')
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  logger = new Logger('WorkersController');

  @Get('list/:username')
  async getWorkersForAgency(@Param('username') username: string) {
    this.logger.log(`Getting workers for agency ${username}`);
    return await this.workersService.getWorkersForAgency({ username });
  }

  @Get('unassigned/list/:username')
  async getUnassignedWorkersForAgency(@Param('username') username: string) {
    this.logger.log(`Getting unassigned workers for agency ${username}`);
    return await this.workersService.getWorkersForAgency({ username }, true);
  }

  @Post('increase-request')
  async createWorkerIncreaseRequest(
    @Body() createWorkerIncreaseRequestDto: CreateWorkerIncreaseRequestDto,
  ): Promise<void> {
    return await this.workersService.createWorkerIncreaseRequest(
      createWorkerIncreaseRequestDto,
    );
  }

  @Get('increase-request/list/:username')
  async getWorkerIncreaseRequestsForAgency(
    @Param('username') username: string,
  ) {
    this.logger.log(`Getting worker increase requests for agency ${username}`);
    return await this.workersService.getAllWorkerIncreaseRequestsForAgency({
      username,
    });
  }

  @Get('increase-request/pending')
  async getAllPendingWorkerIncreaseRequests() {
    this.logger.log(`Getting all pending worker increase requests`);
    return await this.workersService.getAllPendingWorkerIncreaseRequests();
  }

  @Post('increase-request/approve')
  async approveWorkerIncreaseRequest(
    @Body() approveWorkerIncreaseRequestDto: ApproveWorkerIncreaseRequestDto,
  ) {
    this.logger.log(
      `Approving worker increase request ${approveWorkerIncreaseRequestDto.id}`,
    );
    return await this.workersService.approveWorkerIncreaseRequest(
      approveWorkerIncreaseRequestDto,
    );
  }

  @Post('increase-request/reject')
  async rejectWorkerIncreaseRequest(
    @Body() rejectWorkerIncreaseRequestDto: RejectWorkerIncreaseRequestDto,
  ) {
    this.logger.log(
      `Rejecting worker increase request ${rejectWorkerIncreaseRequestDto.id}`,
    );
    return await this.workersService.rejectWorkerIncreaseRequest(
      rejectWorkerIncreaseRequestDto,
    );
  }

  @Post('upsert')
  async upsertWorker(@Body() upsertWorkerDto: UpsertWorkerDto) {
    this.logger.log(`Upserting worker ${JSON.stringify(upsertWorkerDto)}`);
    return await this.workersService.upsertWorker(upsertWorkerDto);
  }

  @Delete('delete/:id')
  async deleteWorker(@Param('id') id: string) {
    this.logger.log(`Deleting worker ${id}`);
    return await this.workersService.deleteWorker({ id: parseInt(id) });
  }
}

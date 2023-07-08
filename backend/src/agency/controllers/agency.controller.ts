import {
  Logger,
  Body,
  Request,
  Controller,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import {
  AgencyBasicInfoSearchQueryDto,
  AgencyQueryDto,
} from '../dtos/agency.dto';
import { AgencyService } from '../services/agency.service';

@Controller('agency')
export class AgencyController {
  constructor(private agencyService: AgencyService) {}

  logger = new Logger('AgencyController');

  @Post('search')
  async search(
    @Body() agencyBasicInfoSearchQueryDto: AgencyBasicInfoSearchQueryDto,
  ) {
    this.logger.log(
      `Searching for agencies ${JSON.stringify(agencyBasicInfoSearchQueryDto)}`,
    );
    return this.agencyService.searchForAgencies(agencyBasicInfoSearchQueryDto);
  }

  @Get(':id')
  async getAgency(@Param('id') id: number) {
    const agencyQueryDto: AgencyQueryDto = { id: id, depersonalized: false };
    return this.agencyService.getAgency(agencyQueryDto);
  }
  @Get('depersonalized/:id')
  async getAgencyDepersonalized(@Param('id') id: number) {
    const agencyQueryDto: AgencyQueryDto = { id: id, depersonalized: true };
    return this.agencyService.getAgency(agencyQueryDto);
  }
}

import { Controller } from '@nestjs/common';
import { SeederService } from '../services/seeder.service';
import { Post } from '@nestjs/common';
@Controller('seeder')
export class SeederController {
  constructor(private seederService: SeederService) {}

  @Post('seed')
  async seed() {
    await this.seederService.clearTables();
    await this.seederService.seed();
  }
}

import { Module } from '@nestjs/common';
import { AgencyService } from './services/agency.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AgencyController } from './controllers/agency.controller';
@Module({
  imports: [PrismaModule],
  providers: [AgencyService],
  controllers: [AgencyController],
})
export class AgencyModule {}

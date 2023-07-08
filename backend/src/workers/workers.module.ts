import { Module } from '@nestjs/common';
import { WorkersService } from './services/workers.service';
import { WorkersController } from './controllers/workers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [WorkersService],
})
export class WorkersModule {}

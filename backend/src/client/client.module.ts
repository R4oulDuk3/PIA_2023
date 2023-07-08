import { Module } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { ClientController } from './controller/client.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}

import { Module } from '@nestjs/common';
import { ObjectController } from './controllers/object.controller';
import { ObjectService } from './services/object.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ObjectController],
  providers: [ObjectService],
  exports: [ObjectService],
})
export class ObjectModule {}

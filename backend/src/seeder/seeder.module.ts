import { Module } from '@nestjs/common';
import { SeederService } from './services/seeder.service';
import { AuthModule } from '../auth/auth.module';
import { AgencyModule } from '../agency/agency.module';
import { ClientModule } from '../client/client.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ObjectModule } from 'src/object/object.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { WorkersModule } from 'src/workers/workers.module';
import { SeederController } from './controllers/seeder.controller';
@Module({
  imports: [
    AuthModule,
    AgencyModule,
    ClientModule,
    PrismaModule,
    ObjectModule,
    WorkersModule,
    JobsModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
  controllers: [SeederController],
})
export class SeederModule {}

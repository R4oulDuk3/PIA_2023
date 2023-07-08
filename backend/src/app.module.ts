import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AgencyModule } from './agency/agency.module';
import { ClientModule } from './client/client.module';
import { SeederModule } from './seeder/seeder.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { ImageUploadController } from './image-upload/controllers/image-upload.controller';
import { ProfileModule } from './profile/profile.module';
import { ObjectModule } from './object/object.module';
import { JobsModule } from './jobs/jobs.module';
import { WorkersModule } from './workers/workers.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AgencyModule,
    ClientModule,
    SeederModule,
    ImageUploadModule,
    ProfileModule,
    ObjectModule,
    JobsModule,
    WorkersModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ImageUploadController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

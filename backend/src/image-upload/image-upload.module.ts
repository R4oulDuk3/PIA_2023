import { Module } from '@nestjs/common';
import { ImageUploadController } from './controllers/image-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { S3UploaderService } from './s3-uploader/s3-uploader.service';
@Module({
  controllers: [ImageUploadController],
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [S3UploaderService],
  exports: [S3UploaderService],
})
export class ImageUploadModule {}

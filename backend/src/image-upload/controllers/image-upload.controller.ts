import {
  Controller,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ImageUploadSuccessfullDto } from '../dtos/image-upload.dto';
import { S3UploaderService } from '../s3-uploader/s3-uploader.service';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private s3UploaderService: S3UploaderService) {}
  logger = new Logger('ImageUploadController');
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    this.logger.log(`Uploading files: ${JSON.stringify(files)}`);
    const urls = [];
    for (const file of files) {
      const res = await this.s3UploaderService.upload(file, true);
      this.logger.log(`File uploaded successfully. URL: ${res}`);
      urls.push(res);
    }
    return new ImageUploadSuccessfullDto(urls);
  }
}

import { Logger, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class S3UploaderService {
  async upload(file: Express.Multer.File, publicRead = false): Promise<string> {
    const { originalname, buffer } = file;
    const bucketS3 = 'pia-projekat-bucket';
    const name = this.generateRandomName(originalname);
    const url = await this.uploadS3(buffer, bucketS3, name, publicRead);
    return url;
  }

  async uploadS3(
    file: Buffer,
    bucket: string,
    name: string,
    publicRead = false,
  ): Promise<string> {
    const s3 = this.getS3();
    const params: S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ACL: publicRead ? 'public-read' : 'private',
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data.Location);
      });
    });
  }

  private generateRandomName(originalname: string): string {
    const extension = this.getFileExtension(originalname);
    const randomName = uuidv4();
    return `${randomName}.${extension}`;
  }

  private getFileExtension(filename: string): string {
    const extensionIndex = filename.lastIndexOf('.');
    if (extensionIndex !== -1) {
      return filename.slice(extensionIndex + 1);
    }
    return '';
  }

  private getS3(): S3 {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}

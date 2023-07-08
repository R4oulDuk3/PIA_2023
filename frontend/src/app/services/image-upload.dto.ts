import { IsNotEmpty } from 'class-validator';

export class ImageUploadSuccessfullDto {
  @IsNotEmpty()
  imageNames: string[];
}

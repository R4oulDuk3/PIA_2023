import { IsNotEmpty } from 'class-validator';

export class ImageUploadSuccessfullDto {
  constructor(imageNames: string[]) {
    this.imageNames = imageNames;
  }
  @IsNotEmpty()
  imageNames: string[];
}

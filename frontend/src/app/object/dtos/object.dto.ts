import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpsertObjectChartDto {
  rooms: UpsertObjectRoomDto[];
  doors: UpsertObjectDoorDto[];
}

export class UpsertObjectRoomDto {
  @IsNotEmpty()
  cordX: number;

  @IsNotEmpty()
  cordY: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;
}

export class UpsertObjectDoorDto {
  @IsNotEmpty()
  cordX: number;

  @IsNotEmpty()
  cordY: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;
}

export class UpsertObjectDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  upsertChartObjectDto: UpsertObjectChartDto;

  @IsNotEmpty()
  username: string;
}

export class GetSimpleObjectsForUserDto {
  @IsNotEmpty()
  username: string;
}

export class SimpleObjectForUserResultDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  area: number;

  @IsNotEmpty()
  roomCount: number;
}

export class GetSimpleObjectForUserResultDto {
  objects: SimpleObjectForUserResultDto[];
}

export class GetObjectForUserDto {
  @IsNotEmpty()
  id: number;
}

export class GetObjectForUserResultDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  rooms: GetObjectRoomResultDto[];

  @IsNotEmpty()
  doors: GetObjectDoorResultDto[];
}

export class GetObjectRoomResultDto {
  @IsNotEmpty()
  cordX: number;

  @IsNotEmpty()
  cordY: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;
}

export class GetObjectDoorResultDto {
  @IsNotEmpty()
  cordX: number;

  @IsNotEmpty()
  cordY: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  height: number;
}

export class DeleteObjectDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;
}

export class DeleteObjectResultDto {
  @IsNotEmpty()
  message: string;
}

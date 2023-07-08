import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJobRequestDto {
  @IsNotEmpty()
  agencyId: number;

  @IsNotEmpty()
  objectId: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;
}

export class GetJobRequestsDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class GetJobRequestResponseDto {
  id: number;
  startDate: Date;
  endDate: Date;
  agencyName: string;
  objectAddress: string;
  status: string;
  offer?: number;
}

export class GetJobRequestListResponseDto {
  jobRequests: GetJobRequestResponseDto[];
}

export class GetJobRequestsWithUserAndObjectDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class GetJobRequestsWithUserAndObjectResultDto {
  jobRequests: GetJobRequestsWithUserAndObjectResultJobRequestDto[];
}

export class GetJobRequestsWithUserAndObjectResultJobRequestDto {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  offer?: number;
  userInfo: GetJobRequestsWithUserAndObjectResultUserInfoDto;
  objectInfo: GetJobRequestsWithUserAndObjectResultObjectInfoDto;
}

export class GetJobRequestsWithUserAndObjectResultUserInfoDto {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export class GetJobRequestsWithUserAndObjectResultObjectInfoDto {
  id: number;
  address: string;
  city: string;
  country: string;
  area: number;
  type: string;
  rooms: GetJobRequestsWithUserAndObjectResultObjectInfoRoomDto[];
  doors: GetJobRequestsWithUserAndObjectResultObjectInfoDoorDto[];
}

export class GetJobRequestsWithUserAndObjectResultObjectInfoRoomDto {
  cordX: number;
  cordY: number;
  width: number;
  height: number;
}

export class GetJobRequestsWithUserAndObjectResultObjectInfoDoorDto {
  cordX: number;
  cordY: number;
  width: number;
  height: number;
}

export class MakeOfferForJobRequestDto {
  @IsNotEmpty()
  @IsNumber()
  offer: number;

  @IsNotEmpty()
  jobRequestId: number;
}

export class RejectJobRequestDto {
  @IsNotEmpty()
  jobRequestId: number;
}

export class AcceptJobRequestDto {
  @IsNotEmpty()
  jobRequestId: number;
}

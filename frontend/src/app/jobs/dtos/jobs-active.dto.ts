import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetSimpleJobListDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  userType: string;
}

export class GetSimpleJobListResultDto {
  jobs: GetSimpleJobListResultJobDto[];
}

export class GetSimpleJobListResultJobDto {
  id: number;
  startDate: Date;
  endDate: Date;
  state: string;
  price: number;
  agencyName: string;
  objectAddress: string;
}

export class GetActiveJobDto {
  @IsNotEmpty()
  @IsNumber()
  jobId: number;
}

export class GetActiveJobResultDto {
  id: number;
  startDate: Date;
  endDate: Date;
  state: string;
  price: number;
  agencyName: string;
  objectAddress: string;
  rooms: GetActiveJobResultRoomDto[];
  doors: GetActiveJobResultDoorDto[];
  roomProgress: GetActiveJobResultRoomProgressDto[];
  assignedWorkers: GetActiveJobResultRoomProgressWorkerDto[];
}

export class GetActiveJobResultRoomProgressDto {
  roomId: number;
  state: string;
}

export class GetActiveJobResultRoomProgressWorkerDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  specialization: string;
}

export class GetActiveJobResultRoomDto {
  id: number;
  cordX: number;
  cordY: number;
  width: number;
  height: number;
}

export class GetActiveJobResultDoorDto {
  cordX: number;
  cordY: number;
  width: number;
  height: number;
}

export class AssignWorkerDto {
  @IsNotEmpty()
  @IsNumber()
  jobId: number;

  @IsNotEmpty()
  workerId: number;
}

export class StartWorkOnRoomDto {
  @IsNotEmpty()
  @IsNumber()
  jobId: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}

export class FinishWorkOnRoomDto {
  @IsNotEmpty()
  @IsNumber()
  jobId: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}

export class PayAndCommentJobDto {
  @IsNotEmpty()
  @IsNumber()
  jobId: number;

  @IsString()
  comment: string;

  @IsNumber()
  rating: number;
}

import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetAgencyWorkersDto {
  @IsNotEmpty()
  username: string;
}

export class GetAgencyWorkersResultDto {
  currentWorkerCount: number;
  maxWorkerCount: number;
  workers: GetAgencyWorkersResultWorkerDto[];
}

export class GetAgencyWorkersResultWorkerDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  specialization: string;
}

export class CreateWorkerIncreaseRequestDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  maxWorkerCount: number;
}

export class GetAllPendingWorkerIncreaseRequestsResultDto {
  requests: GetAllPendingWorkerIncreaseRequestsResultRequestDto[];
}

export class GetAllPendingWorkerIncreaseRequestsResultRequestDto {
  id: number;
  agencyId: number;
  agencyName: string;
  newMaxWorkerCount: number;
}

export class GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto {
  requests: GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto[];
}

export class GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto {
  id: number;
  agencyId: number;
  agencyName: string;
  newMaxWorkerCount: number;
  currentWorkerCount: number;
  status: string;
}

export class GetWorkerIncreaseRequestsForAgencyDto {
  @IsNotEmpty()
  username: string;
}

export class GetWorkerIncreaseRequestsForAgencyResultDto {
  requests: GetWorkerIncreaseRequestsForAgencyResultRequestDto[];
}

export class GetWorkerIncreaseRequestsForAgencyResultRequestDto {
  id: number;
  newMaxWorkerCount: number;
  status: string;
}

export class ApproveWorkerIncreaseRequestDto {
  @IsNotEmpty()
  id: number;
}

export class RejectWorkerIncreaseRequestDto {
  @IsNotEmpty()
  id: number;
}

export class UpsertWorkerDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  specialization: string;

  @IsNotEmpty()
  agencyUsername: string;
}

export class DeleteWorkerDto {
  @IsNotEmpty()
  id: number;
}

import { IsNotEmpty } from 'class-validator';

export class GetClientUserInfoDto {
  @IsNotEmpty()
  username: string;
}

export class GetClientUserInfoResultDto {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  image: string;
}

export class GetClientUserInfoListResultDto {
  clients: GetClientUserInfoResultDto[];
}

export class GetAgencyUserInfoDto {
  @IsNotEmpty()
  username: string;
}

export class GetAgencyUserInfoResultDto {
  username: string;
  name: string;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  image: string;
}

export class GetAgencyUserInfoListResultDto {
  agencies: GetAgencyUserInfoResultDto[];
}

export class UpdateClientUserInfoDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  surname: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  image: string;
}

export class UpdateAgencyUserInfoDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  image: string;
}

export class DeleteUserDto {
  @IsNotEmpty()
  username: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class BecomeUserDto {
  @IsNotEmpty()
  username: string;
}

export class BecomeUserSuccessfullDto {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  username: string;
}

export class LoginSuccessfullDto {
  constructor(access_token: string, type: string, username: string) {
    this.access_token = access_token;
    this.type = type;
    this.username = username;
  }

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  username: string;
}

export class RegisterClientDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsString()
  image: string;
}

export class RegisterRequestSubmitedSuccessfullyDto {
  constructor(message: string) {
    this.message = message;
  }
  @IsNotEmpty()
  message: string;
}

export class RegisterAgencyDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  uniqueCode: string;

  @IsNotEmpty()
  description: string;

  @IsString()
  image: string;
}

export class HandleRegistrationRequestDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  status: string;
}

export class RegistrationRequestDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  idUser: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  type: string;
}

export class GetRegistrationRequestsDto {
  @IsNotEmpty()
  registrationRequests: RegistrationRequestDto[];
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @IsString()
  username: string;
}

export class UpdateClientInfoDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  image: string;
}

export class GetAllUsersInfoDto {
  @IsNotEmpty()
  users: GetAllUsersInfoUserDto[];
}

export class GetAllUsersInfoUserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  type: string;
}

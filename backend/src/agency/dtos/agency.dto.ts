import { IsNotEmpty, IsString } from 'class-validator';

export class AgencyBasicInfoSearchQueryDto {
  @IsString()
  name: string;

  @IsString()
  adress: string;

  @IsNotEmpty()
  sortNameAsc: boolean;

  @IsNotEmpty()
  sortAdressAsc: boolean;
}

export class AgencyBasicInfoSearchResultDto {
  agencies: AgencyBasicInfoDto[];

  constructor(agencies: AgencyBasicInfoDto[]) {
    this.agencies = agencies;
  }
}

export class AgencyBasicInfoDto {
  id: number;
  name: string;
  image: string;
  description: string;
  address: string;

  constructor(
    id: number,
    name: string,
    image: string,
    description: string,
    address: string,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.address = address;
  }
}

export class AgencyQueryDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  depersonalized: boolean;
}

export class AgencyQueryResultDto {
  id: number;
  name: string;
  image: string;
  description: string;
  uniqueCode: string;
  address: string;
  city: string;
  country: string;
  comments: CommentDto[];
}

export class CommentDto {
  id: number;
  text: string;
  rating: number;
  user: UserDto;

  constructor(id: number, text: string, rating: number, user: UserDto) {
    this.id = id;
    this.text = text;
    this.rating = rating;
    this.user = user;
  }
}

export class UserDto {
  id: number;
  name: string;
  image: string;

  constructor(id: number, name: string, image: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}

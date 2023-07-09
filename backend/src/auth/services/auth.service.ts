import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, RequestStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  BecomeUserDto,
  BecomeUserSuccessfullDto,
  GetRegistrationRequestsDto,
  HandleRegistrationRequestDto,
  LoginSuccessfullDto,
  RegisterAgencyDto,
  RegisterClientDto,
  RegisterRequestSubmitedSuccessfullyDto,
  RegistrationRequestDto,
  UpdatePasswordDto,
} from '../dtos/auth.dto';
import { Logger } from '@nestjs/common';
import { log } from 'console';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, pass: string): Promise<any> {
    const user: User | null = await this.prismaService.user.findFirst({
      where: {
        username: username,
      },
    });
    this.logger.debug(`Validating user ${username}, ${user}`);

    if (user && user.password === pass && user.approved) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async registerClient(
    registerClientDto: RegisterClientDto,
    autoApprove = false,
  ): Promise<any> {
    this.prismaService.$transaction(async (prisma) => {
      const user: User | null = await prisma.user.create({
        data: {
          username: registerClientDto.username,
          password: registerClientDto.password,
          phone: registerClientDto.phone,
          image: registerClientDto.image,
          approved: false,
          email: registerClientDto.email,
          type: 'client',
        },
      });
      await prisma.client.create({
        data: {
          name: registerClientDto.name,
          surname: registerClientDto.surname,
          idUser: user.id,
        },
      });
      if (autoApprove) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            approved: true,
          },
        });
      } else {
        await prisma.registrationRequest.create({
          data: {
            idUser: user.id,
            status: 'pending',
          },
        });
      }
    });
    return new RegisterRequestSubmitedSuccessfullyDto(
      'Your request has been submitted successfully.',
    );
  }

  async registerAgency(
    registerAgencyDto: RegisterAgencyDto,
    autoApprove = false,
  ): Promise<any> {
    this.logger.debug(
      `Registering agency ${JSON.stringify(registerAgencyDto)}`,
    );
    this.prismaService.$transaction(async (prisma) => {
      const user: User | null = await prisma.user.create({
        data: {
          username: registerAgencyDto.username,
          password: registerAgencyDto.password,
          phone: registerAgencyDto.phone,
          image: registerAgencyDto.image,
          approved: false,
          email: registerAgencyDto.email,
          type: 'agency',
        },
      });
      const location = await prisma.location.create({
        data: {
          address: registerAgencyDto.address,
          city: registerAgencyDto.city,
          country: registerAgencyDto.country,
        },
      });
      await prisma.agency.create({
        data: {
          name: registerAgencyDto.name,
          uniqueCode: registerAgencyDto.uniqueCode,
          idLocation: location.id,
          idUser: user.id,
          description: registerAgencyDto.description,
        },
      });
      if (autoApprove) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            approved: true,
          },
        });
      } else {
        await prisma.registrationRequest.create({
          data: {
            idUser: user.id,
            status: 'pending',
          },
        });
      }
    });
    return new RegisterRequestSubmitedSuccessfullyDto(
      'Your request has been submitted successfully.',
    );
  }

  async createAdmin(): Promise<any> {
    return this.prismaService.$transaction(async (prisma) => {
      await prisma.user.create({
        data: {
          username: 'admin',
          password: 'admin',
          phone: 'admin',
          image: 'admin',
          approved: true,
          email: 'admin',
          type: 'admin',
        },
      });
    });
  }

  async handleRegistrationRequest(
    handleRegistrationRequestDto: HandleRegistrationRequestDto,
  ): Promise<any> {
    this.logger.log('Appoving user: ', handleRegistrationRequestDto);

    handleRegistrationRequestDto.status;
    await this.prismaService.registrationRequest.update({
      where: {
        id: handleRegistrationRequestDto.id,
      },
      data: {
        status: RequestStatus[handleRegistrationRequestDto.status],
      },
    });
    const registrationRequest =
      await this.prismaService.registrationRequest.findUnique({
        where: {
          id: handleRegistrationRequestDto.id,
        },
        include: {
          user: true,
        },
      });
    this.logger.log('Registration request: ', registrationRequest);
    if (handleRegistrationRequestDto.status === 'accepted') {
      await this.prismaService.user.update({
        where: {
          id: registrationRequest.idUser,
        },
        data: {
          approved: true,
        },
      });
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<any> {
    this.prismaService.$transaction(async (prisma) => {
      const user: User | null = await prisma.user.findFirst({
        where: {
          username: updatePasswordDto.username,
          password: updatePasswordDto.oldPassword,
        },
      });
      if (user) {
        await prisma.user.update({
          where: {
            username: updatePasswordDto.username,
          },
          data: {
            password: updatePasswordDto.newPassword,
          },
        });
      } else {
        throw new HttpException(
          "Old password doesn't match.",
          HttpStatus.FORBIDDEN,
        );
      }
    });
  }

  async getAllPendingRegistrationRequests(): Promise<GetRegistrationRequestsDto> {
    const registrationRequests =
      await this.prismaService.registrationRequest.findMany({
        where: {
          status: 'pending',
        },
        include: {
          user: true,
        },
      });
    this.logger.log(`Registration requests: ${registrationRequests}`);

    const registrationRequestDtos: RegistrationRequestDto[] = [];

    registrationRequests.forEach((registrationRequest) => {
      const registrationRequestDto: RegistrationRequestDto = {
        id: registrationRequest.id,
        idUser: registrationRequest.idUser,
        username: registrationRequest.user.username,
        email: registrationRequest.user.email,
        phone: registrationRequest.user.phone,
        image: registrationRequest.user.image,
        type: registrationRequest.user.type,
      };
      registrationRequestDtos.push(registrationRequestDto);
    });
    return { registrationRequests: registrationRequestDtos };
  }

  async login(user: {
    username: string;
    userId: number;
    type: string;
    [key: string]: any;
  }) {
    const payload = { username: user.username, sub: user.userId };

    return new LoginSuccessfullDto(
      this.jwtService.sign(payload),
      user.type,
      user.username,
    );
  }

  async becomeUser(
    becomeUserDto: BecomeUserDto,
  ): Promise<BecomeUserSuccessfullDto> {
    const user: User | null = await this.prismaService.user.findFirst({
      where: {
        username: becomeUserDto.username,
      },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return {
      username: user.username,
      type: user.type,
    };
  }

  async seed() {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await this.createAdmin();
    const registerAgencyDto: RegisterAgencyDto = {
      username: 'agency',
      password: 'Agency1',
      phone: '+381641234560',
      image:
        'https://pia-projekat-bucket.s3.eu-west-2.amazonaws.com/default.png',
      email: 'steelmen@gmail.com',
      name: 'SteelMen',
      uniqueCode: '12341234',
      address: 'Banovo brdo 1',
      city: 'Beograd',
      country: 'Srbija',
      description: 'Best agency in the world',
    };
    const registerAgencyDto2: RegisterAgencyDto = {
      username: 'agency2',
      password: 'Agency2',
      phone: '+381641234561',
      image:
        'https://pia-projekat-bucket.s3.eu-west-2.amazonaws.com/default.png',
      email: 'easypeasy@gmail.com',
      name: 'EasyPeasy',
      uniqueCode: '21342134',
      address: 'Banovo brdo 2',
      city: 'Beograd',
      country: 'Srbija',
      description: 'We will do it for you, easy peasy',
    };
    const registerAgencyDto3: RegisterAgencyDto = {
      username: 'agency3',
      password: 'Agency3',
      phone: '+381641234562',
      image:
        'https://pia-projekat-bucket.s3.eu-west-2.amazonaws.com/default.png',
      email: 'workhardplayhard@gmail.com',
      name: 'Work Hard Play Hard',
      uniqueCode: '31233123',
      address: 'Banovo brdo 3',
      city: 'Beograd',
      country: 'Srbija',
      description: 'We work hard and play hard',
    };

    await this.registerAgency(registerAgencyDto);
    await this.registerAgency(registerAgencyDto2);
    await this.registerAgency(registerAgencyDto3);
    const registerClientDto: RegisterClientDto = {
      username: 'client1',
      surname: 'Doe',
      password: 'Client1',
      phone: '+381641234565',
      image:
        'https://pia-projekat-bucket.s3.eu-west-2.amazonaws.com/default.png',
      email: 'jhondoe@gmail.com',
      name: 'Jhon',
    };
    await this.registerClient(registerClientDto);
    await sleep(1000);
    const pendingRegistrationReqs =
      await this.getAllPendingRegistrationRequests();
    console.log('pendingRegistrationReqs: ', pendingRegistrationReqs);
    let registrationLimit = 2;
    await pendingRegistrationReqs.registrationRequests.forEach(
      async (registrationRequest) => {
        if (registrationLimit-- <= 0) return;
        await this.handleRegistrationRequest({
          id: registrationRequest.id,
          status: 'accepted',
        });
      },
    );
  }
}

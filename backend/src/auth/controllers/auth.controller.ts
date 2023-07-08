import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import {
  RegisterClientDto,
  RegisterAgencyDto,
  LoginDto,
  HandleRegistrationRequestDto,
  BecomeUserDto,
  UpdatePasswordDto,
} from '../dtos/auth.dto';

import { Logger } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'result Token' })
  async login(@Request() req) {
    this.logger.debug(`Login user ${req.user.username}`);
    return this.authService.login(req.user);
  }

  @Post('register/client')
  async registerClient(@Body() registerClientDto: RegisterClientDto) {
    return this.authService.registerClient(registerClientDto);
  }

  @Post('create/client')
  async createClient(@Body() registerClientDto: RegisterClientDto) {
    return this.authService.registerClient(registerClientDto, true);
  }

  @Post('register/agency')
  async registerAgency(@Body() registerAgencyDto: RegisterAgencyDto) {
    return this.authService.registerAgency(registerAgencyDto);
  }

  @Post('create/agency')
  async createAgency(@Body() registerAgencyDto: RegisterAgencyDto) {
    return this.authService.registerAgency(registerAgencyDto, true);
  }

  @Post('password/update')
  async resetPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @Get('register/request/list')
  async getRegisterRequests() {
    return this.authService.getAllPendingRegistrationRequests();
  }

  @Post('register/request/handle')
  async handleRegisterRequest(
    @Body() handleRegisterRequestDto: HandleRegistrationRequestDto,
  ) {
    return this.authService.handleRegistrationRequest(handleRegisterRequestDto);
  }

  @Post('become')
  async becomeUser(@Body() becomeUserDto: BecomeUserDto) {
    return this.authService.becomeUser(becomeUserDto);
  }
}

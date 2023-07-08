import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import {
  DeleteUserDto,
  GetClientUserInfoDto,
  UpdateAgencyUserInfoDto,
  UpdateClientUserInfoDto,
} from '../dtos/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  logger = new Logger('ClientController');

  @Get('client/:username')
  async getClient(@Param('username') username: string) {
    this.logger.log(`Getting client ${username}`);
    const getUserInfoDto: GetClientUserInfoDto = { username: username };
    return await this.profileService.getClient(getUserInfoDto);
  }

  @Get('agency/:username')
  async getAgency(@Param('username') username: string) {
    this.logger.log(`Getting agency ${username}`);
    return await this.profileService.getAgency({ username: username });
  }

  @Post('client/update')
  async updateClient(@Body() updateClientUserInfoDto: UpdateClientUserInfoDto) {
    this.logger.log(`Updating client ${updateClientUserInfoDto.username}`);
    return await this.profileService.updateClient(updateClientUserInfoDto);
  }

  @Post('agency/update')
  async updateAgency(@Body() updateAgencyUserInfoDto: UpdateAgencyUserInfoDto) {
    this.logger.log(`Updating agency ${updateAgencyUserInfoDto.username}`);
    return await this.profileService.updateAgency(updateAgencyUserInfoDto);
  }

  @Get('list/client')
  async getAllClientProfiles() {
    this.logger.log(`Getting client list`);
    return await this.profileService.getAllClientProfiles();
  }

  @Get('list/agency')
  async getAllAgencyProfiles() {
    this.logger.log(`Getting agency list`);
    return await this.profileService.getAllAgencyProfiles();
  }

  @Post('delete')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return this.profileService.deleteUser(deleteUserDto);
  }
}

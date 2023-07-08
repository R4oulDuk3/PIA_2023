import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ObjectService } from '../services/object.service';
import {
  DeleteObjectDto,
  GetObjectForUserDto,
  UpsertObjectDto,
} from '../dtos/object.dto';
@Controller('object')
export class ObjectController {
  constructor(private objectService: ObjectService) {}

  logger = new Logger('ObjectController');

  @Post('upsert')
  async createObject(@Body() upsertObjectDto: UpsertObjectDto) {
    this.logger.log(`Upserting object ${JSON.stringify(upsertObjectDto)}`);
    return this.objectService.createObject(upsertObjectDto);
  }

  @Get('all/:username')
  async getObjectsForUser(
    @Param('username') username: string,
    @Query('requestless') requestless: boolean,
  ) {
    const getObjectsForUserDto = {
      username,
      requestless,
    };
    this.logger.log(
      `Getting objects for user ${JSON.stringify(getObjectsForUserDto)}`,
    );
    return this.objectService.getSimpleObjectsForUser(getObjectsForUserDto);
  }

  @Get(':id')
  async getObjectForUser(@Param('id') id: string) {
    const getObjectForUserDto: GetObjectForUserDto = { id: parseInt(id) };
    return this.objectService.getObjectForUser(getObjectForUserDto);
  }

  @Post('delete')
  async deleteObject(@Body() deleteObjectDto: DeleteObjectDto) {
    return this.objectService.deleteObjectForUser(deleteObjectDto);
  }
}

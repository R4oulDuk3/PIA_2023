import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ClientService } from '../services/client.service';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}
  logger = new Logger('ClientController');
}

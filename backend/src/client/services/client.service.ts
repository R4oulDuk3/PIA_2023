import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prismaService: PrismaService) {}

  logger = new Logger('ClientService');
}

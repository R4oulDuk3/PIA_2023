import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder/services/seeder.service';
import { AppModule } from './app.module';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);
  await seederService.seed();
}

seed();

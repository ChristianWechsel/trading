import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../certificates/localhost.key')),
    cert: readFileSync(join(__dirname, '../certificates/localhost.cert')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

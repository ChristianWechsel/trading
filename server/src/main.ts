import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  // Zertifikate immer relativ zum Projekt-Root suchen, egal ob dist oder src
  const basePath = process.cwd();
  const httpsOptions = {
    key: readFileSync(join(basePath, 'certificates/localhost.key')),
    cert: readFileSync(join(basePath, 'certificates/localhost.cert')),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.setBaseViewsDir(join(__dirname, '../views'));
  app.setViewEngine('pug');

  const usersService = app.get(UsersService);
  const newAdmin = await usersService.createAdminUserIfNotExists();
  if (newAdmin) {
    console.log('########################################################');
    console.log('Admin-User wurde automatisch angelegt!');
    console.log('Benutzername: ' + newAdmin.username);
    console.log('Passwort:     ' + newAdmin.password);
    console.log('Bitte dieses Passwort sicher speichern!');
    console.log('########################################################');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Fehler beim Starten der App:', err);
  process.exit(1);
});

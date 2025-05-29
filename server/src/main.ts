import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { readFileSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(__dirname, '../certificates/localhost.key')),
    cert: readFileSync(join(__dirname, '../certificates/localhost.cert')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
bootstrap();

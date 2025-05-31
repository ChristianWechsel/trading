import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM if needed in the future
import * as Joi from 'joi';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        DB_PASSWORD: Joi.string()
          .pattern(
            new RegExp(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]).{8,}$',
            ),
          )
          .required()
          .messages({
            'string.pattern.base':
              'DB_PASSWORD must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
          }),
        JWT_SECRET: Joi.string()
          .min(32)
          .pattern(
            new RegExp(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]).{32,}$',
            ),
          )
          .required()
          .messages({
            'string.pattern.base':
              'JWT_SECRET must be at least 32 characters long and include uppercase, lowercase, number, and special character.',
          }),
        VAPID_PUBLIC_KEY: Joi.string().required().messages({
          'any.required':
            'VAPID_PUBLIC_KEY is required. Please generate it using create_vapid_keys.sh and add it to the .env file.',
        }),
        VAPID_PRIVATE_KEY: Joi.string().required().messages({
          'any.required':
            'VAPID_PRIVATE_KEY is required. Please generate it using create_vapid_keys.sh and add it to the .env file.',
        }),
        VAPID_MAIL: Joi.string().email().required().messages({
          'any.required':
            'VAPID_MAIL is required. Please add a valid mail address to the .env file.',
          'string.email': 'VAPID_MAIL must be a valid email address.',
        }),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'trading_user',
        password: configService.get('DB_PASSWORD'),
        database: 'trading',
        entities: [User],
        synchronize: false, // Temporär true für die Tabellenerstellung,
      }),
    }),
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 5 }],
    }),
    NotificationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static/',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

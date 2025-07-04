import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AnalysisModule } from './analysis/analysis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CalendarEvent } from './calendar-event/calendar-event.entity';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { DataAggregationModule } from './data-aggregation/data-aggregation.module';
import { EodPrice } from './data-aggregation/eod-price.entity';
import { Security } from './data-aggregation/security.entity';
import { NotificationModule } from './notification/notification.module';
import { PushSubscription } from './notification/push-subscription.entity';
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
        EODHD_API_KEY: Joi.string().required().messages({
          'any.required':
            'EODHD_API_KEY is required. Please add your End Of Day Historical Data API key to the .env file.',
        }),
        AUTH_TOKEN_COOKIE_NAME: Joi.string()
          .min(3)
          .max(64)
          .pattern(/^[a-zA-Z0-9]+$/)
          .messages({
            'string.pattern.base':
              'AUTH_TOKEN_COOKIE_NAME may only contain letters, numbers, underscores, and hyphens.',
          }),
        AUTH_TOKEN_MAX_AGE: Joi.number()
          .integer()
          .min(60000)
          .max(604800000)
          .messages({
            'number.base':
              'AUTH_TOKEN_MAX_AGE must be a number (milliseconds).',
            'number.min':
              'AUTH_TOKEN_MAX_AGE must be at least 60000 (1 Minute).',
            'number.max':
              'AUTH_TOKEN_MAX_AGE must be at most 604800000 (7 Tage).',
          }),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/static/',
    }),
    AuthModule,
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
        entities: [User, PushSubscription, CalendarEvent, EodPrice, Security],
        synchronize: false, // Temporär true für die Tabellenerstellung,
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 5 }],
    }),
    NotificationModule,
    CalendarEventModule,

    DataAggregationModule,
    AnalysisModule,
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

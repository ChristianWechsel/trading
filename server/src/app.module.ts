import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeORM if needed in the future
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

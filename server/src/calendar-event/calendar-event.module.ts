import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { CalendarEventController } from './calendar-event.controller';
import { CalendarEvent } from './calendar-event.entity';
import { CalendarEventService } from './calendar-event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEvent]),
    NotificationModule,
    AuthModule,
    ConfigModule,
  ],
  providers: [CalendarEventService],
  controllers: [CalendarEventController],
  exports: [CalendarEventService],
})
export class CalendarEventModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { CalendarEventController } from './calendar-event.controller';
import { CalendarEvent } from './calendar-event.entity';
import { CalendarEventService } from './calendar-event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEvent]),
    forwardRef(() => NotificationModule),
  ],
  providers: [CalendarEventService],
  controllers: [CalendarEventController],
  exports: [CalendarEventService],
})
export class CalendarEventModule {}

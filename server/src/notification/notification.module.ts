import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEventModule } from '../calendar-event/calendar-event.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushSubscription } from './push-subscription.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PushSubscription]),
    CalendarEventModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

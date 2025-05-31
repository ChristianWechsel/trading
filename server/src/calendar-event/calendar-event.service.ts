import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { CreateCalendarEventDto } from './calendar-event.dto';
import { CalendarEvent } from './calendar-event.entity';

@Injectable()
export class CalendarEventService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly eventRepo: Repository<CalendarEvent>,
    private readonly notificationService: NotificationService,
  ) {}

  create(dto: CreateCalendarEventDto) {
    const event = this.eventRepo.create(dto);
    return this.eventRepo.save(event);
  }

  findAll() {
    return this.eventRepo.find();
  }

  findOne(id: number) {
    return this.eventRepo.findOneBy({ id });
  }

  remove(id: number) {
    return this.eventRepo.delete(id);
  }

  // Cronjob: prüft jede Minute auf anstehende Events und benachrichtigt
  @Cron(CronExpression.EVERY_MINUTE)
  async notifyUpcomingEvents() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60 * 1000);
    // Finde Events, die in der nächsten Minute stattfinden
    const events = await this.eventRepo
      .createQueryBuilder('event')
      .where('event.eventDate >= :now AND event.eventDate < :nextMinute', {
        now: now.toISOString().slice(0, 19).replace('T', ' '),
        nextMinute: nextMinute.toISOString().slice(0, 19).replace('T', ' '),
      })
      .getMany();
    for (const event of events) {
      await this.notificationService.sendNotificationToAll({
        title: `Kalenderereignis: ${event.title}`,
        body: event.description || '',
        url: undefined,
      });
    }
  }
}

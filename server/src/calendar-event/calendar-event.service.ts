import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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

  // Cronjob: prüft alle 10 Minuten auf anstehende Events und benachrichtigt
  @Cron(CronExpression.EVERY_MINUTE)
  async notifyUpcomingEvents() {
    const now = new Date();
    const nextTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);
    // Finde Events, die in den nächsten 10 Minuten stattfinden
    // const events = await this.eventRepo
    //   .createQueryBuilder('event')
    //   .where('event.eventDate >= :now AND event.eventDate < :nextTenMinutes', {
    //     now: now.toISOString().slice(0, 19).replace('T', ' '),
    //     nextTenMinutes: nextTenMinutes
    //       .toISOString()
    //       .slice(0, 19)
    //       .replace('T', ' '),
    //   })
    //   .getMany();

    const events = await this.eventRepo.find({
      where: {
        eventDate:
          MoreThanOrEqual(new Date('2025-01-01')) &&
          LessThanOrEqual(nextTenMinutes),
      },
    });
    for (const event of events) {
      await this.notificationService.sendNotificationToAll({
        title: `Kalenderereignis: ${event.title}`,
        body: event.description || '',
        url: undefined,
      });
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationService } from '../notification/notification.service';
import { CalendarEvent } from './calendar-event.entity';
import { CalendarEventService } from './calendar-event.service';

describe('CalendarEventService', () => {
  let service: CalendarEventService;
  let eventRepo: any;
  let notificationService: any;

  beforeEach(async () => {
    eventRepo = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockResolvedValue({ id: 1 }),
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      findOne: jest.fn().mockResolvedValue(null),
    };
    notificationService = { sendNotificationToAll: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarEventService,
        { provide: getRepositoryToken(CalendarEvent), useValue: eventRepo },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();
    service = module.get<CalendarEventService>(CalendarEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const dto = { title: 'Test', eventDate: new Date().toISOString() };
    await service.create(dto as any);
    expect(eventRepo.create).toHaveBeenCalledWith(dto);
    expect(eventRepo.save).toHaveBeenCalled();
  });

  it('should find all events', async () => {
    await service.findAll();
    expect(eventRepo.find).toHaveBeenCalled();
  });

  it('should find one event', async () => {
    await service.findOne(1);
    expect(eventRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should remove an event', async () => {
    await service.remove(1);
    expect(eventRepo.delete).toHaveBeenCalledWith(1);
  });
});

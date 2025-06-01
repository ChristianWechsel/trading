import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { PayloadDto } from './payload.dto';
import { PushSubscriptionDto } from './push-subscription.dto';
import { PushSubscription } from './push-subscription.entity';

const mockRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

describe('NotificationService', () => {
  let service: NotificationService;
  let repo: ReturnType<typeof mockRepo>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    repo = mockRepo();
    configService = { get: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: ConfigService, useValue: configService },
        { provide: getRepositoryToken(PushSubscription), useValue: repo },
      ],
    }).compile();
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add subscription if not exists', async () => {
    repo.findOne.mockResolvedValue(undefined);
    repo.save.mockResolvedValue({ endpoint: 'a', p256dh: 'b', auth: 'c' });
    const dto: PushSubscriptionDto = {
      endpoint: 'a',
      keys: { p256dh: 'b', auth: 'c' },
    };
    await service.addSubscription(dto);
    expect(repo.save).toHaveBeenCalledWith({
      endpoint: 'a',
      p256dh: 'b',
      auth: 'c',
    });
  });

  it('should not add subscription if exists', async () => {
    repo.findOne.mockResolvedValue({ endpoint: 'a' });
    const dto: PushSubscriptionDto = {
      endpoint: 'a',
      keys: { p256dh: 'b', auth: 'c' },
    };
    await service.addSubscription(dto);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should send notification to all and delete on error', async () => {
    jest.resetModules();
    jest.doMock('web-push', () => ({
      sendNotification: jest.fn().mockImplementation((sub: any) => {
        if (sub.endpoint === 'fail') return Promise.reject(new Error('fail'));
        return Promise.resolve();
      }),
      setVapidDetails: jest.fn(),
    }));
    repo.find.mockResolvedValue([
      { endpoint: 'ok', p256dh: 'b', auth: 'c' },
      { endpoint: 'fail', p256dh: 'b', auth: 'c' },
    ]);
    repo.delete.mockResolvedValue(undefined);
    const payload: PayloadDto = { title: 't', body: 'b' };
    await service.sendNotificationToAll(payload);
    expect(repo.delete).toHaveBeenCalledWith({ endpoint: 'fail' });
  });
});

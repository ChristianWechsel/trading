import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PushSubscriptionDto } from './push-subscription.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: { addSubscription: jest.Mock; sendNotificationToAll: jest.Mock };
  let configService: { get: jest.Mock };

  beforeEach(async () => {
    service = {
      addSubscription: jest.fn(),
      sendNotificationToAll: jest.fn(),
    };
    configService = { get: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: service },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    controller = module.get(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return empty object for registerNotification', () => {
    expect(controller.registerNotification()).toEqual({});
  });

  it('should get vapid public key', () => {
    const res = {
      type: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    configService.get.mockReturnValue('key');
    controller.getVapidPublicKey(res);
    expect(res.type).toHaveBeenCalledWith('text/plain');
    expect(res.send).toHaveBeenCalledWith('key');
  });

  it('should call addSubscription and return success', async () => {
    const dto: PushSubscriptionDto = {
      endpoint: 'a',
      keys: { p256dh: 'b', auth: 'c' },
    };
    const result = await controller.subscribe(dto);
    expect(service.addSubscription).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ success: true });
  });

  it('should call sendNotificationToAll and return success', async () => {
    const body = { title: 't', body: 'b' };
    const result = await controller.sendNotification(body);
    expect(service.sendNotificationToAll).toHaveBeenCalledWith(body);
    expect(result).toEqual({ success: true });
  });
});

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Public } from 'src/auth/public.decorator';
import { NotificationService } from './notification.service';
import { PushSubscriptionDto } from './push-subscription.dto';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('register')
  @Render('register-notification')
  registerNotification() {
    return {}; // Placeholder for template data; update with specific view data if needed
  }

  @Public()
  @Get('vapid-public-key')
  getVapidPublicKey(@Res() res: Response) {
    const key = this.configService.get<string>('VAPID_PUBLIC_KEY');
    res.type('text/plain').send(key);
  }

  @Public()
  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  subscribe(@Body() subscription: PushSubscriptionDto) {
    this.notificationService.addSubscription(subscription);
    return { success: true };
  }

  // Test-Endpoint: Sendet eine Beispielbenachrichtigung an alle
  @Post('send')
  async sendNotification(
    @Body() body: { title: string; body: string; url?: string },
  ) {
    await this.notificationService.sendNotificationToAll(body);
    return { success: true };
  }
}

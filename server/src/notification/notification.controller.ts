import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Public()
  @Get('register')
  registerNotification() {
    return this.notificationService.registerNotification();
  }
}

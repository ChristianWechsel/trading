import { Controller, Get, Render } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Public()
  @Get('register')
  @Render('register-notification')
  registerNotification() {
    return {}; // Placeholder for template data; update with specific view data if needed
  }
}

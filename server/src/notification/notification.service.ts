import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  registerNotification() {
    console.log('registerNotification');
  }
}

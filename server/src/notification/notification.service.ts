import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sendNotification, setVapidDetails } from 'web-push';
import { PushSubscriptionDto } from './push-subscription.dto';

@Injectable()
export class NotificationService {
  private subscriptions: PushSubscriptionDto[] = [];

  constructor(private readonly configService: ConfigService) {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    if (publicKey && privateKey) {
      setVapidDetails('mailto:admin@example.com', publicKey, privateKey);
    }
  }

  addSubscription(subscription: PushSubscriptionDto) {
    if (!this.subscriptions.find((s) => s.endpoint === subscription.endpoint)) {
      this.subscriptions.push(subscription);
    }
  }

  async sendNotificationToAll(payload: {
    title: string;
    body: string;
    url?: string;
  }): Promise<void> {
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url,
    });
    for (const sub of this.subscriptions) {
      try {
        await sendNotification(sub, notificationPayload);
      } catch {
        this.subscriptions = this.subscriptions.filter(
          (s) => s.endpoint !== sub.endpoint,
        );
      }
    }
  }
}

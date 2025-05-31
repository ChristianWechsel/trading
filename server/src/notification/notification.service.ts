import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sendNotification, setVapidDetails } from 'web-push';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushSubscription } from './push-subscription.entity';
import { PushSubscriptionDto } from './push-subscription.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(PushSubscription)
    private readonly subscriptionRepo: Repository<PushSubscription>,
  ) {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const mail = this.configService.get<string>('VAPID_MAIL');
    if (publicKey && privateKey && mail) {
      setVapidDetails(`mailto:${mail}`, publicKey, privateKey);
    }
  }

  async addSubscription(subscription: PushSubscriptionDto) {
    const exists = await this.subscriptionRepo.findOne({
      where: { endpoint: subscription.endpoint },
    });
    if (!exists) {
      await this.subscriptionRepo.save({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      });
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
    const allSubs = await this.subscriptionRepo.find();
    for (const sub of allSubs) {
      try {
        await sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          notificationPayload,
        );
      } catch {
        await this.subscriptionRepo.delete({ endpoint: sub.endpoint });
      }
    }
  }
}

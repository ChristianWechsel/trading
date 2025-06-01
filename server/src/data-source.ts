import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { CalendarEvent } from './calendar-event/calendar-event.entity';
import { EodPrice } from './data-aggregation/eod-price.entity';
import { Security } from './data-aggregation/security.entity';
import { PushSubscription } from './notification/push-subscription.entity';
import { User } from './users/user.entity';

dotenv.config({ path: join(__dirname, '../.env') });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'trading_user',
  password: process.env.DB_PASSWORD,
  database: 'trading',
  entities: [User, PushSubscription, CalendarEvent, Security, EodPrice],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
});

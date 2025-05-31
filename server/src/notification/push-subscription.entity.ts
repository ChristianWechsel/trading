import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PushSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  endpoint: string;

  @Column()
  p256dh: string;

  @Column()
  auth: string;
}

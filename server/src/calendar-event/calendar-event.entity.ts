import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'datetime' })
  eventDate: Date;

  @Column({ default: false })
  recurring: boolean;

  @Column({ nullable: true })
  recurrenceRule?: string;
}

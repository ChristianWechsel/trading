import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class EodPrice {
  @PrimaryColumn()
  securityId: number;

  @PrimaryColumn({ type: 'date' })
  priceDate: string;

  @Column('decimal', { precision: 12, scale: 4 })
  openPrice: number;

  @Column('decimal', { precision: 12, scale: 4 })
  highPrice: number;

  @Column('decimal', { precision: 12, scale: 4 })
  lowPrice: number;

  @Column('decimal', { precision: 12, scale: 4 })
  closePrice: number;

  @Column('decimal', { precision: 12, scale: 4 })
  adjustedClosePrice: number;

  @Column('bigint')
  volume: number;
}

import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['symbol', 'exchangeId'])
export class Security {
  @PrimaryGeneratedColumn()
  securityId: number;

  @Column({ length: 20 })
  symbol: string;

  @Column({ length: 10 })
  exchangeId: string;

  @Column({
    length: 30,
    unique: true,
    generatedType: 'STORED',
    asExpression: `CONCAT(symbol, '.', exchangeId)`,
  })
  tickerFull: string;

  @Column({ length: 255, nullable: true })
  companyName?: string;

  @Column({ length: 50, nullable: true })
  assetType?: string;
}

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class OHLCVEntity {
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

export class OHLCV {
  constructor(private ohlcvData: OHLCVEntity) {}

  getSecurityId(): number {
    return this.ohlcvData.securityId;
  }
  getPriceIsoDate(): string {
    return this.ohlcvData.priceDate;
  }
  getPriceEpochTime(): number {
    return new Date(this.ohlcvData.priceDate).getTime();
  }
  getOpenPrice(): number {
    return this.ohlcvData.openPrice;
  }
  getHighPrice(): number {
    return this.ohlcvData.highPrice;
  }
  getLowPrice(): number {
    return this.ohlcvData.lowPrice;
  }
  getClosePrice(): number {
    return this.ohlcvData.closePrice;
  }
  getAdjustedClosePrice(): number {
    return this.ohlcvData.adjustedClosePrice;
  }
  getVolume(): number {
    return this.ohlcvData.volume;
  }
  clone(): OHLCV {
    return new OHLCV({ ...this.ohlcvData });
  }
}

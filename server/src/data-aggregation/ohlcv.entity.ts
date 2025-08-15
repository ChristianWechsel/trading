import { Column, Entity, PrimaryColumn, ValueTransformer } from 'typeorm';

const numberTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | number) => Number(value),
};

@Entity()
export class OHLCVEntity {
  @PrimaryColumn()
  securityId: number;

  @PrimaryColumn({ type: 'date' })
  priceDate: string;

  @Column('decimal', {
    precision: 12,
    scale: 4,
    transformer: numberTransformer,
  })
  openPrice: number;

  @Column('decimal', {
    precision: 12,
    scale: 4,
    transformer: numberTransformer,
  })
  highPrice: number;

  @Column('decimal', {
    precision: 12,
    scale: 4,
    transformer: numberTransformer,
  })
  lowPrice: number;

  @Column('decimal', {
    precision: 12,
    scale: 4,
    transformer: numberTransformer,
  })
  closePrice: number;

  @Column('decimal', {
    precision: 12,
    scale: 4,
    transformer: numberTransformer,
  })
  adjustedClosePrice: number;

  @Column('bigint', { transformer: numberTransformer })
  volume: number;
}

export class OHLCV {
  constructor(private ohlcvData: OHLCVEntity) {}

  getSecurityId(): number {
    return this.ohlcvData.securityId;
  }
  getPriceDateIsoDate(): string {
    return this.ohlcvData.priceDate;
  }
  getPriceDateEpochTime(): number {
    return new Date(this.ohlcvData.priceDate).getTime();
  }
  getPriceDate(): Date {
    return new Date(this.ohlcvData.priceDate);
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

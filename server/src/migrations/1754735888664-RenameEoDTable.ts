import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameEoDTable1754735888664 implements MigrationInterface {
  name = 'RenameEoDTable1754735888664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`RENAME TABLE eod_price TO ohlcv_entity`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`RENAME TABLE ohlcv_entity TO eod_price`);
  }
}

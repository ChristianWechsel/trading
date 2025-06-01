import { MigrationInterface, QueryRunner } from 'typeorm';

export class EOD1748775467681 implements MigrationInterface {
  name = 'EOD1748775467681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`eod_price\` (\`securityId\` int NOT NULL, \`priceDate\` date NOT NULL, \`openPrice\` decimal(12,4) NOT NULL, \`highPrice\` decimal(12,4) NOT NULL, \`lowPrice\` decimal(12,4) NOT NULL, \`closePrice\` decimal(12,4) NOT NULL, \`adjustedClosePrice\` decimal(12,4) NOT NULL, \`volume\` bigint NOT NULL, PRIMARY KEY (\`securityId\`, \`priceDate\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`security\` (\`securityId\` int NOT NULL AUTO_INCREMENT, \`symbol\` varchar(20) NOT NULL, \`exchangeId\` varchar(10) NOT NULL, \`tickerFull\` varchar(30) AS (CONCAT(symbol, '.', exchangeId)) STORED NOT NULL, \`companyName\` varchar(255) NULL, \`assetType\` varchar(50) NULL, UNIQUE INDEX \`IDX_f77bda4f516301d213e82e8acc\` (\`tickerFull\`), UNIQUE INDEX \`IDX_5ed00fbe8ed75c5ac61a20074b\` (\`symbol\`, \`exchangeId\`), PRIMARY KEY (\`securityId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `INSERT INTO \`trading\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, ?, ?, ?, ?)`,
      [
        'trading',
        'security',
        'GENERATED_COLUMN',
        'tickerFull',
        "CONCAT(symbol, '.', exchangeId)",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`trading\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ? AND \`table\` = ?`,
      ['GENERATED_COLUMN', 'tickerFull', 'trading', 'security'],
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5ed00fbe8ed75c5ac61a20074b\` ON \`security\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f77bda4f516301d213e82e8acc\` ON \`security\``,
    );
    await queryRunner.query(`DROP TABLE \`security\``);
    await queryRunner.query(`DROP TABLE \`eod_price\``);
  }
}

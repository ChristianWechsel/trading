import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCalendarEvent1748699552398 implements MigrationInterface {
  name = 'CreateCalendarEvent1748699552398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`calendar_event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`eventDate\` datetime NOT NULL, \`recurring\` tinyint NOT NULL DEFAULT 0, \`recurrenceRule\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`calendar_event\``);
  }
}

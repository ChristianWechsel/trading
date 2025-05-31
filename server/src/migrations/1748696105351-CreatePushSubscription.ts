import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePushSubscription1748696105351 implements MigrationInterface {
  name = 'CreatePushSubscription1748696105351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`push_subscription\` (\`id\` int NOT NULL AUTO_INCREMENT, \`endpoint\` varchar(255) NOT NULL, \`p256dh\` varchar(255) NOT NULL, \`auth\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_27ae9074fc39a09bc1aee263df\` (\`endpoint\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_27ae9074fc39a09bc1aee263df\` ON \`push_subscription\``,
    );
    await queryRunner.query(`DROP TABLE \`push_subscription\``);
  }
}

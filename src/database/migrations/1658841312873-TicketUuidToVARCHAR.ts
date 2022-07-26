import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketUuidToVARCHAR1658841312873 implements MigrationInterface {
  name = 'migrations1658841312873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "uuid" character varying(14) NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "uuid"`);
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`
    );
  }
}

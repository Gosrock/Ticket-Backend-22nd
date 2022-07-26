import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketStatusAddEnum1658837628780 implements MigrationInterface {
  name = 'TicketStatusAddEnum1658837628780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."ticket_status_enum" RENAME TO "ticket_status_enum_old"`
    );

    await queryRunner.query(
      `CREATE TYPE "public"."ticket_status_enum_migration" AS ENUM('입장완료', '입금확인', '확인대기', '기한만료' ,'입장대기')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_status_enum" AS ENUM('입장완료', '입금확인', '확인대기', '기한만료' )`
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" DROP DEFAULT`
    );

    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" TYPE "public"."ticket_status_enum_migration" USING "status"::"text"::"public"."ticket_status_enum_migration"`
    );
    await queryRunner.query(
      `UPDATE "ticket"
          SET status = '확인대기'
          WHERE status = '입장대기' ;`
    );

    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" TYPE "public"."ticket_status_enum" USING "status"::"text"::"public"."ticket_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" SET DEFAULT '확인대기'`
    );

    await queryRunner.query(`DROP TYPE "public"."ticket_status_enum_old"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_status_enum_migration"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_status_enum_old" AS ENUM('입장완료', '입장대기')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_status_enum_migration" AS ENUM('입장완료', '입금확인', '확인대기', '기한만료' ,'입장대기')`
    );

    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" DROP DEFAULT`
    );

    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" TYPE "public"."ticket_status_enum_migration" USING "status"::"text"::"public"."ticket_status_enum_migration"`
    );
    await queryRunner.query(
      `UPDATE "ticket"
            SET status = '입장대기'
            WHERE status IN('확인대기', '기한만료' ,'입장대기') ;`
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" TYPE "public"."ticket_status_enum_old" USING "status"::"text"::"public"."ticket_status_enum_old"`
    );

    await queryRunner.query(
      `ALTER TABLE "ticket" ALTER COLUMN "status" SET DEFAULT '입장대기'`
    );
    await queryRunner.query(`DROP TYPE "public"."ticket_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_status_enum_migration"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."ticket_status_enum_old" RENAME TO "ticket_status_enum"`
    );
  }
}

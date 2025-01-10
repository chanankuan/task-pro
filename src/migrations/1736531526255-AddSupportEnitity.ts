import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupportEnitity1736531526255 implements MigrationInterface {
  name = 'AddSupportEnitity1736531526255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "support_cases" ("id" SERIAL NOT NULL, "user_id" integer, CONSTRAINT "PK_c4cc80fe374d1965c37576527b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "support_cases" ADD CONSTRAINT "FK_5a99a9d58af4a0e3093e2d14252" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "support_cases" DROP CONSTRAINT "FK_5a99a9d58af4a0e3093e2d14252"`,
    );
    await queryRunner.query(`DROP TABLE "support_cases"`);
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1745115587453 implements MigrationInterface {
  name = 'Init1745115587453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "app_entity" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "description" text NOT NULL,
        "isActive" boolean NOT NULL,
        CONSTRAINT "PK_app_entity" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_app_entity_name" ON "app_entity" ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_app_entity_name"`);
    await queryRunner.query(`DROP TABLE "app_entity"`);
  }
}

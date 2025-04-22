import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoogleOAuthToUsers1745300984899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "provider" ENUM('local', 'google') NOT NULL DEFAULT 'local',
            ADD COLUMN "providerId" VARCHAR(255),
            ADD COLUMN "pictureUrl" VARCHAR(255)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "provider",
            DROP COLUMN "providerId",
            DROP COLUMN "pictureUrl"
        `);
  }
}

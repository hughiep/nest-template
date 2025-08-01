import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1749824118642 implements MigrationInterface {
  name = 'Init1749824118642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_provider_enum" AS ENUM('local', 'google')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isActive" boolean NOT NULL DEFAULT true, "refreshToken" character varying, "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'local', "providerId" character varying, "pictureUrl" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_provider_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}

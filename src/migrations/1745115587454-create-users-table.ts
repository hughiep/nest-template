import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1745115587454 implements MigrationInterface {
  name = 'CreateUsersTable1745115587454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the enum type with error handling
    try {
      await queryRunner.query(`
        CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')
      `);
    } catch (error: any) {
      // If the type already exists, we can safely continue
      if (error.code !== '42710') { // PostgreSQL error code for "type already exists"
        throw error;
      }
    }

    // Create the users table with error handling
    try {
      await queryRunner.query(`
        CREATE TABLE "users" (
          "id" SERIAL NOT NULL,
          "email" character varying(100) NOT NULL,
          "name" character varying(100) NOT NULL,
          "password" character varying NOT NULL,
          "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
          "isActive" boolean NOT NULL DEFAULT true,
          "refreshToken" character varying,
          CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
          CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        )
      `);
    } catch (error: any) {
      // If the table already exists, we can safely continue
      if (error.code !== '42P07') { // PostgreSQL error code for "relation already exists"
        throw error;
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop with error handling
    try {
      await queryRunner.query(`DROP TABLE "users"`);
    } catch (error: any) {
      // Ignore if table doesn't exist
      if (error.code !== '42P01') { // PostgreSQL error code for "relation does not exist"
        throw error;
      }
    }
    
    try {
      await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    } catch (error: any) {
      // Ignore if type doesn't exist
      if (error.code !== '42704') { // PostgreSQL error code for "type does not exist"
        throw error;
      }
    }
  }
}

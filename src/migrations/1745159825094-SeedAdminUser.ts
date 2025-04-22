import type { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

// Type guard for PostgreSQL errors
function isPostgresError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export class SeedAdminUser1745159825094 implements MigrationInterface {
  name = 'SeedAdminUser1745159825094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      // Check if admin user already exists
      const result = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM users
                    WHERE email = 'admin@example.com'
                );
            `);

      const adminExists = result[0].exists;

      if (!adminExists) {
        // Generate hashed password for the admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt);

        // Insert admin user
        await queryRunner.query(`
                    INSERT INTO "users" ("email", "name", "password", "role")
                    VALUES ('admin@example.com', 'Admin User', '${hashedPassword}', 'admin')
                `);

        console.log('Admin user seeded successfully');
      } else {
        console.log('Admin user already exists, skipping seed');
      }
    } catch (error) {
      // If there's any error other than a duplicate key violation, throw it
      if (isPostgresError(error) && error.code === '23505') {
        // PostgreSQL error code for "unique violation"
        console.log(
          'Admin user already exists (caught duplicate key error), skipping seed',
        );
      } else {
        throw error;
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Remove the admin user
      await queryRunner.query(`
                DELETE FROM "users"
                WHERE "email" = 'admin@example.com'
            `);
      console.log('Admin user removed successfully');
    } catch (error) {
      // If there's any error related to the table not existing, ignore it
      if (isPostgresError(error) && error.code === '42P01') {
        // PostgreSQL error code for "relation does not exist"
        console.log('Users table does not exist, nothing to remove');
      } else {
        throw error;
      }
    }
  }
}

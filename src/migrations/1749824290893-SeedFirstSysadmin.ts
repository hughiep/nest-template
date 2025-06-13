import type { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcryptjs';

export class SeedFirstSysadmin1749824290893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if sysadmin already exists
    const existingAdmin = await queryRunner.query(
      `SELECT id FROM users WHERE email = $1`,
      ['admin@system.com'],
    );

    if (existingAdmin.length === 0) {
      // Hash the default password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123!', salt);

      // Insert the first sysadmin user
      await queryRunner.query(
        `
        INSERT INTO users (
          email,
          name,
          password,
          role,
          "isActive",
          provider,
          "providerId",
          "pictureUrl",
          "refreshToken"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        `,
        [
          'admin@system.com',
          'System Administrator',
          hashedPassword,
          'admin',
          true,
          'local',
          null,
          null,
          null,
        ],
      );

      console.log('✅ First sysadmin user created successfully');
      console.log('📧 Email: admin@system.com');
      console.log('🔑 Password: Admin@123!');
      console.log('⚠️  Please change the password after first login');
    } else {
      console.log('ℹ️  Sysadmin user already exists, skipping...');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the seeded sysadmin user
    await queryRunner.query(`DELETE FROM users WHERE email = $1`, [
      'admin@system.com',
    ]);

    console.log('🗑️  Sysadmin user removed');
  }
}

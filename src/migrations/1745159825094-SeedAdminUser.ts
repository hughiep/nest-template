import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcryptjs';

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
        } catch (error: any) {
            // If there's any error other than a duplicate key violation, throw it
            if (error.code !== '23505') { // PostgreSQL error code for "unique violation"
                throw error;
            }
            console.log('Admin user already exists (caught duplicate key error), skipping seed');
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
        } catch (error: any) {
            // If there's any error related to the table not existing, ignore it
            if (error.code !== '42P01') { // PostgreSQL error code for "relation does not exist"
                throw error;
            }
            console.log('Users table does not exist, nothing to remove');
        }
    }
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash the password if it was modified and not already hashed
    if (this.password && !this.password.startsWith('$2b$')) {
      if (bcrypt) {
        try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
          console.warn('Failed to hash password:', error);
        }
      }
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!bcrypt) return false;

    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Password validation error:', error);
      return false;
    }
  }
}

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

import { UserRole, AuthProvider } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsEnum(AuthProvider)
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsString()
  pictureUrl?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsEnum(AuthProvider)
  provider?: AuthProvider;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsString()
  pictureUrl?: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  provider: AuthProvider;
  pictureUrl?: string;
}

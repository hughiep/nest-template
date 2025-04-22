import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  ALLOWED_ORIGINS?: string = 'http://localhost:3000';

  @IsString()
  @IsOptional()
  API_PREFIX?: string = 'api';

  @IsString()
  @IsOptional()
  API_TITLE?: string = 'NestJS API';

  @IsString()
  @IsOptional()
  API_DESCRIPTION?: string = 'NestJS API Description';

  @IsString()
  @IsOptional()
  API_VERSION?: string = '1.0';

  // Database configuration
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  DB_MAX_CONNECTIONS: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(1)
  DB_POOL_TIMEOUT: number = 30000;

  // JWT Configuration
  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'your-jwt-secret-key-change-in-production';

  @IsString()
  @IsOptional()
  JWT_REFRESH_SECRET: string =
    'your-jwt-refresh-secret-key-change-in-production';

  @IsString()
  @IsOptional()
  JWT_EXPIRATION: string = '15m';

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRATION: string = '7d';

  // Google OAuth Configuration
  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_SECRET: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  GOOGLE_CALLBACK_URL: string =
    'http://localhost:5005/api/auth/google/callback';

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_URL: string = 'http://localhost:3000';
}

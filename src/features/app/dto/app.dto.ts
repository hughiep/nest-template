import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAppDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateAppDto {
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsString()
  description?: string;

  @IsBoolean()
  isActive?: boolean;
}

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}

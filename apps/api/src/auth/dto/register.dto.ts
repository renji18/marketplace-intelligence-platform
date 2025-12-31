import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Roles {
  seller = 'seller',
  buyer = 'buyer',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

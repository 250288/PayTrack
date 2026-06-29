import { IsString, IsPhoneNumber, MinLength, IsOptional } from 'class-validator';

export class SignupDto {
  @IsPhoneNumber()
  phoneNumber!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}

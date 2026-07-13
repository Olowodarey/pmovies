import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
  @Matches(/[\d\W]/, { message: 'Password must contain at least one number or special character.' })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

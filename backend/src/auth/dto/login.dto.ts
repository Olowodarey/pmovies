import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  // On login we only need a basic length check — complexity is enforced at
  // signup time. A strict regex here would lock out users who changed their
  // requirements policy later.
  @MinLength(6)
  password: string;
}

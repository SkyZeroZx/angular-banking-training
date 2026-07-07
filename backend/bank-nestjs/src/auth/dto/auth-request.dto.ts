import { IsDefined, IsString, Length, Matches, MinLength } from 'class-validator';

export class AuthRequestDto {
  @IsDefined({ message: 'Username is required' })
  @IsString()
  @Matches(/\S/, { message: 'Username is required' })
  @Length(3, 50, { message: 'Username must be between 3 and 50 characters' })
  username: string;

  @IsDefined({ message: 'Password is required' })
  @IsString()
  @Matches(/\S/, { message: 'Password is required' })
  @MinLength(4, { message: 'Password must be at least 4 characters' })
  password: string;
}

export interface AuthResponseDto {
  token: string;
  username: string;
  role: string;
}

export interface TokenValidationResponseDto {
  valid: boolean;
  username?: string;
  role?: string;
}

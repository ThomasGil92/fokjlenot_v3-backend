import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../user.types';

export class CreateNewUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo: string;
  @IsEmail()
  email: string;
  @IsOptional()
  @IsEnum(['USER', 'ADMIN'], { message: 'Valid role required' })
  role?: UserRole;
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'The rules for the password are not respected' },
  )
  password?: string;
  @IsOptional()
  googleId: string;
}

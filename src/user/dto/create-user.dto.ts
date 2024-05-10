import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
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
  @IsEnum(['USER', 'ADMIN'], { message: 'Valid role required' })
  role: UserRole;
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
  password: string;
}

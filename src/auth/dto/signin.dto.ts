import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;
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

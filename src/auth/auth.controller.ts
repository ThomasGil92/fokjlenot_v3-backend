import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup/google')
  async googleAuthSignup(@Body('token') token: string) {
    const ticket = await this.authService.verifyGoogleToken(token);
    const { sub, email } = ticket.getPayload();

    return this.authService.signupGoogleUser(sub, email);
  }
  @HttpCode(HttpStatus.OK)
  @Post('signin/google')
  async googleAuthSignin(@Body('token') token: string) {
    const ticket = await this.authService.verifyGoogleToken(token);
    const { email } = ticket.getPayload();

    return this.authService.signinGoogleUser(email);
  }
}

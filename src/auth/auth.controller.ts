import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
/* import { SignInDTO } from './dto/signin.dto'; */
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Request() req) {
    return await this.authService.signIn(req.user);
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

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}

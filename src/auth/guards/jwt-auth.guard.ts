import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired'); // Utilisez UnauthorizedException avec un message personnalisé
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

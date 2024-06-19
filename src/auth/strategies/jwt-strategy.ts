import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    console.log('jwt');
    return { user: payload };
  }
  /* handleRequest(err, user, info) {
    console.log(info.name);
    if (info && info.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expired');
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  } */
}

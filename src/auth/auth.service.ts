import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async signIn(
    email: string,
    pwd: string,
  ): Promise<{ access_token: string; user: Prisma.UserWhereInput }> {
    const user = await this.userService.findUser(email);

    if (
      !this.isPasswordValid({ password: pwd, hashedPassword: user.password })
    ) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email };
    delete user.password;
    return { access_token: await this.jwtService.signAsync(payload), user };
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }

  async signupGoogleUser(
    sub: string,
    email: string,
  ): Promise<{ access_token: string; user: Prisma.UserWhereInput }> {
    let user = await this.userService.findUser(email);

    if (!user) {
      user = await this.userService.createGoogleUser({
        googleId: sub,
        email,
        pseudo: 'Pseudo',
      });
      // Générer un JWT pour l'utilisateur
      const jwt = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      });
      return { access_token: jwt, user };
    }
    throw new ConflictException('User already exist, please login');
  }
  async signinGoogleUser(
    email: string,
  ): Promise<{ access_token: string; user: Prisma.UserWhereInput }> {
    const user = await this.userService.findUser(email);

    if (!user) {
      throw new NotFoundException('User not find, please signup');
    } // Générer un JWT pour l'utilisateur
    const jwt = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });
    return { access_token: jwt, user };
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      return ticket;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google Token');
    }
  }
}

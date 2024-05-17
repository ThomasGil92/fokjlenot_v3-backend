import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNewUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findUser(email: string) {
    const user = this.databaseService.user.findUnique({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new NotFoundException(`User with the email ${email} not found`);
    return user;
  }

  async getUser(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      include: { projects: true, collaboratingProjects: true },
    });
    if (user) return user;
    throw new NotFoundException('User not found');
  }

  async createUser(newUser: CreateNewUserDto) {
    const userExist = await this.databaseService.user.findUnique({
      where: { email: newUser.email },
    });
    if (userExist)
      throw new ConflictException('This email is already registered');

    const saltRounds = 10;
    const myPlaintextPassword = newUser.password;
    const hashedPwd = await hash(myPlaintextPassword, saltRounds);
    return this.databaseService.user.create({
      data: { ...newUser, password: hashedPwd },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNewUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getUser(userId: string) {
    return {
      ...this.databaseService.user.findUnique({
        where: { id: userId },
        include: { projects: true, collaboratingProjects: true },
      }),
    };
  }

  async createUser(newUser: CreateNewUserDto) {
    return this.databaseService.user.create({ data: newUser });
  }
}

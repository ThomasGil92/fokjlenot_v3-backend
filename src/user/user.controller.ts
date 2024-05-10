import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateNewUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateNewUserDto) {
    return this.userService.createUser(createUserDto);
  }
}

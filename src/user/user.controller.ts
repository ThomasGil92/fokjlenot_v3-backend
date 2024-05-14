import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateNewUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateNewUserDto) {
    return this.userService.createUser(createUserDto);
  }
}

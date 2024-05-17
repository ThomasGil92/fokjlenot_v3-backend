import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateNewUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('id/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get('token')
  getUserByToken(@Req() req) {
    const [_, token] = req.headers.authorization?.split(' ') ?? [];
    return this.userService.getUserByToken(token);
  }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateNewUserDto) {
    return this.userService.createUser(createUserDto);
  }
}

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
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('id/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(JwtGuard)
  @Get('token')
  getUserByToken(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = req.headers.authorization?.split(' ') ?? [];
    return this.userService.getUserByToken(token);
  }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateNewUserDto) {
    return this.userService.createUser(createUserDto);
  }
}

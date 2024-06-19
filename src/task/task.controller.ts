import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Patch,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard)
  @Get('tasks/:projectId')
  findTasksByProjectId(@Param('projectId') projectId: string) {
    return this.taskService.findTasksByProjectId(projectId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() { projectId, ...createProjectDto }: CreateTaskDTO) {
    return this.taskService.createTask(projectId, createProjectDto);
  }
  @UseGuards(JwtGuard)
  @Patch('collaborate')
  collaborateUser(
    @Body() { userId, taskId }: { userId: string; taskId: string },
  ) {
    return this.taskService.inviteToCollaborateUserOnTask({
      userId,
      taskId,
    });
  }
  @UseGuards(JwtGuard)
  @Patch('patch')
  @UsePipes(ValidationPipe)
  patchProject(
    @Body()
    updateTaskDto: UpdateTaskDTO,
  ) {
    return this.taskService.update(updateTaskDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}

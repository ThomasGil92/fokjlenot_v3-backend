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
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Get('tasks/:projectId')
  findTasksByProjectId(@Param('projectId') projectId: string) {
    return this.taskService.findTasksByProjectId(projectId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() { projectId, ...createProjectDto }: CreateTaskDTO) {
    return this.taskService.createTask(projectId, createProjectDto);
  }
  @UseGuards(AuthGuard)
  @Patch('collaborate')
  collaborateUser(
    @Body() { userId, taskId }: { userId: string; taskId: string },
  ) {
    return this.taskService.inviteToCollaborateUserOnTask({
      userId,
      taskId,
    });
  }
  @UseGuards(AuthGuard)
  @Patch('patch')
  @UsePipes(ValidationPipe)
  patchProject(
    @Body()
    updateTaskDto: UpdateTaskDTO,
  ) {
    return this.taskService.update(updateTaskDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}

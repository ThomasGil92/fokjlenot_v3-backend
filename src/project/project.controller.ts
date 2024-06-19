import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
  @UseGuards(JwtGuard)
  @Get('all/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.projectService.findByUserId(userId);
  }

  @UseGuards(JwtGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() { ownerId, ...createProjectDto }: CreateProjectDTO) {
    return this.projectService.createProject(ownerId, createProjectDto);
  }
  @UseGuards(JwtGuard)
  @Patch('collaborate')
  collaborateUser(
    @Body() { userId, projectId }: { userId: string; projectId: string },
  ) {
    return this.projectService.inviteToCollaborateUser({
      userId,
      projectId,
    });
  }
  @UseGuards(JwtGuard)
  @Patch('patch')
  @UsePipes(ValidationPipe)
  patchProject(
    @Body()
    updateProjectDto: UpdateProjectDTO,
  ) {
    return this.projectService.update(updateProjectDto);
  }

  @UseGuards(JwtGuard)
  @Delete('id/:id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.delete(id);
  }

  @UseGuards(JwtGuard)
  @Delete('many')
  deleteManyProjects(
    @Body() data: { projectsToDeleteIds: string[]; userId: string },
  ) {
    return this.projectService.deleteManyProjects(
      data.projectsToDeleteIds,
      data.userId,
    );
  }
}

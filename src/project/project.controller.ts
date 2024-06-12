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
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProjectDTO } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Get('all/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.projectService.findByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() { ownerId, ...createProjectDto }: CreateProjectDTO) {
    return this.projectService.createProject(ownerId, createProjectDto);
  }
  @UseGuards(AuthGuard)
  @Patch('collaborate')
  collaborateUser(
    @Body() { userId, projectId }: { userId: string; projectId: string },
  ) {
    return this.projectService.inviteToCollaborateUser({
      userId,
      projectId,
    });
  }
  @UseGuards(AuthGuard)
  @Patch('patch')
  @UsePipes(ValidationPipe)
  patchProject(
    @Body()
    updateProjectDto: UpdateProjectDTO,
  ) {
    return this.projectService.update(updateProjectDto);
  }

  @UseGuards(AuthGuard)
  @Delete('id/:id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.delete(id);
  }

  @UseGuards(AuthGuard)
  @Delete('many')
  deleteManyProjects(@Body() projectsToDelete: { projectsToDelete: string[] }) {
    return this.projectService.deleteManyProjects(
      projectsToDelete.projectsToDelete,
    );
  }
}

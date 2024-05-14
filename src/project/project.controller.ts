import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() { ownerId, ...createProjectDto }: CreateProjectDTO) {
    return this.projectService.createProject(ownerId, createProjectDto);
  }

  @Patch()
  collaborateUser(
    @Body() { userId, projectId }: { userId: string; projectId: string },
  ) {
    console.log(userId, projectId);
    return this.projectService.inviteToCollaborateUser({
      userId,
      projectId,
    });
  }
}

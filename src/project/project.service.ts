import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { Prisma } from '@prisma/client';
import { UpdateProjectDTO } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findOne(id: string) {
    const project = await this.databaseService.project.findUnique({
      where: { id },
      include: { collaborators: true, tasks: true },
    });
    if (!project)
      throw new NotFoundException(`Project with the id "${id}" not found`);

    return project;
  }
  async findByUserId(userId: string) {
    const projectsByUserId = await this.databaseService.project.findMany({
      where: { ownerId: userId },
      include: { tasks: true },
    });
    if (!projectsByUserId) throw new NotFoundException('Aucun projet trouvé');
    
    return projectsByUserId;
  }
  async createProject(
    ownerId: string,
    newProject: Prisma.ProjectCreateWithoutOwnerInput,
  ) {
    return this.databaseService.project.create({
      data: { ...newProject, ownerId: ownerId },
    });
  }
  async inviteToCollaborateUser({
    userId,
    projectId,
  }: {
    userId: string;
    projectId: string;
  }) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      include: { collaboratingProjects: true },
    });
    if (!user)
      throw new NotFoundException(`User with the id "${userId}" not found`);

    const project = await this.databaseService.project.findUnique({
      where: { id: projectId },
      include: { collaborators: true },
    });
    if (!project)
      throw new NotFoundException(`Project with the id "${userId}" not found`);
    const isUserInProject = user?.collaboratingProjects.some(
      (project) => project.id === projectId,
    );
    const isProjectHasCollaboratorById = project?.collaborators.some(
      (user) => user.id === userId,
    );

    const userUpdateAction = isUserInProject
      ? { disconnect: { id: projectId } }
      : { connect: { id: projectId } };
    const projectUpdateAction = isProjectHasCollaboratorById
      ? { disconnect: { id: userId } }
      : { connect: { id: userId } };

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        collaboratingProjects: userUpdateAction,
      },
    });

    await this.databaseService.project.update({
      where: { id: projectId },
      data: {
        collaborators: projectUpdateAction,
      },
    });
    return this.databaseService.user.findUnique({
      where: { id: userId },
      select: { projects: true, collaboratingProjects: true },
    });
  }
  async update(project: UpdateProjectDTO) {
    const updatedProject = {
      title: project.title,
      status: project.status,
    };
    return await this.databaseService.project.update({
      where: { id: project.id },
      data: updatedProject,
    });
  }
  async delete(id: string) {
    return await this.databaseService.project.delete({ where: { id } });
  }
}

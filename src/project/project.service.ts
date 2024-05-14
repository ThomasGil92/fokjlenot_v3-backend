import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}
  async findOne(id) {
    return this.databaseService.project.findUnique({
      where: { id },
      include: { collaborators: true },
    });
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
    await this.databaseService.user.update({
      where: { id: userId },
      data: { collaboratingProjects: { connect: { id: projectId } } },
    });
    return this.databaseService.project.update({
      where: { id: projectId },
      data: {
        collaborators: { connect: { id: userId } },
      },
    });
  }
}

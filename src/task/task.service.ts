import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { Prisma } from '@prisma/client';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findTasksByProjectId(projectId: string) {
    const tasks = await this.databaseService.task.findMany({
      where: { projectId: projectId },
    });
    if (!tasks)
      throw new NotFoundException(
        `Tasks for the project ${projectId} not found`,
      );
    return tasks;
  }

  async findOne(id: string) {
    const task = await this.databaseService.task.findUnique({
      where: { id },
      include: { collaborators: true, project: true },
    });
    if (!task)
      throw new NotFoundException(`Task with the id "${id}" not found`);

    return task;
  }
  async createTask(
    projectId: string,
    newTask: Prisma.TaskCreateWithoutProjectInput,
  ) {
    return this.databaseService.task.create({
      data: { ...newTask, projectId },
    });
  }
  async inviteToCollaborateUserOnTask({
    userId,
    taskId,
  }: {
    userId: string;
    taskId: string;
  }) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      include: { collaboratingTasks: true },
    });
    if (!user)
      throw new NotFoundException(`User with the id "${userId}" not found`);

    const task = await this.databaseService.task.findUnique({
      where: { id: taskId },
      include: { collaborators: true },
    });
    if (!task)
      throw new NotFoundException(`Project with the id "${userId}" not found`);
    const isUserInTask = user?.collaboratingTasks.some(
      (task) => task.id === taskId,
    );
    const isTaskHasCollaboratorById = task?.collaborators.some(
      (user) => user.id === userId,
    );

    const userUpdateAction = isUserInTask
      ? { disconnect: { id: taskId } }
      : { connect: { id: taskId } };
    const taskUpdateAction = isTaskHasCollaboratorById
      ? { disconnect: { id: userId } }
      : { connect: { id: userId } };

    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        collaboratingProjects: userUpdateAction,
      },
    });

    await this.databaseService.task.update({
      where: { id: taskId },
      data: {
        collaborators: taskUpdateAction,
      },
    });
    return this.databaseService.user.findUnique({
      where: { id: userId },
      select: { collaboratingTasks: true },
    });
  }
  async update(task: UpdateTaskDTO) {
    await this.databaseService.task.update({
      where: { id: task.id },
      data: task,
    });

    return this.databaseService.task.findUnique({
      where: { id: task.id },
      select: { project: true },
    });
  }
  async delete(id: string) {
    const task = await this.databaseService.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException('This task does not exist');

    return this.databaseService.task.delete({ where: { id } });
  }
}

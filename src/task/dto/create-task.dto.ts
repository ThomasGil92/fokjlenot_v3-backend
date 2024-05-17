import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty({ message: 'You should provide a title' })
  title: string;

  @IsString()
  @IsOptional()
  description: string;
  @IsOptional()
  priority: TaskPriority;

  @IsEnum(['PENDING', 'PROGRESS', 'DONE'], {
    message: 'valid status is required',
  })
  @IsOptional()
  status: TaskStatus;
  @IsString()
  projectId: string;
}

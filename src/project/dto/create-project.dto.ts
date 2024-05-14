import { ProjectStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsEnum(['PENDING', 'PROGRESS', 'DONE'], {
    message: 'valid status is required',
  })
  @IsOptional()
  status: ProjectStatus;
  @IsString()
  ownerId: string;
}

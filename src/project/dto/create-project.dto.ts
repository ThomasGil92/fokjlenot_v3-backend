import { ProjectStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty({ message: 'You should provide a title' })
  title: string;
  @IsEnum(['PENDING', 'PROGRESS', 'DONE'], {
    message: 'valid status is required',
  })
  @IsString()
  @IsOptional()
  description: string;
  @IsOptional()
  status: ProjectStatus;
  @IsString()
  ownerId: string;
}

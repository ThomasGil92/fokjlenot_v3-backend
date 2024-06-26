import { IsString } from 'class-validator';
import { CreateProjectDTO } from './create-project.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProjectDTO extends PartialType(CreateProjectDTO) {
  @IsString()
  id: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProjectDTO } from './create-project.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProjectDTO extends PartialType(CreateProjectDTO) {
  @IsString()
  @IsNotEmpty({ message: 'You should provide a title' })
  title?: string;
  @IsString()
  id: string;
}

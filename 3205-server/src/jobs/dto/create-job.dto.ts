import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateJobDto {
  @IsArray({ message: 'urls должен быть массивом' })
  @ArrayNotEmpty({ message: 'urls не может быть пустым' })
  @IsString({ each: true, message: 'каждый элемент urls должен быть строкой' })
  urls!: string[];
}

import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  publishedYear: number;
}

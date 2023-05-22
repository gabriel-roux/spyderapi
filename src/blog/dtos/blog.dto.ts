import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  postId?: string;
}

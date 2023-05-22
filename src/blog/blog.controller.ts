import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { BlogService } from './blog.service';
import { BlogDto } from './dtos/blog.dto';

import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';

const multerConfig = {
  storage: diskStorage({
    destination: process.cwd() + '/uploads',
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${randomUUID()}.${fileExt}`);
    },
  }),
};

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('getAll')
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const blogs = await this.blogService.findAll(limit, page);

    if (!blogs) {
      throw new NotFoundException('Blogs not found');
    }

    return blogs;
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const blog = await this.blogService.findOne(id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(@Body() blog: BlogDto, @UploadedFile() image) {
    const { title, content } = blog;

    const newBlog = await this.blogService.create(
      image.filename,
      title,
      content,
    );

    if (!newBlog) {
      throw new BadRequestException('Blog not created');
    }

    return newBlog;
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(@Body() blog: BlogDto, @UploadedFile() image) {
    const updatedBlog = await this.blogService.update({
      ...blog,
      image: image.filename,
    });

    if (!updatedBlog) {
      throw new BadRequestException('Blog not updated');
    }

    return updatedBlog;
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Body() blog: BlogDto) {
    const deletedBlog = await this.blogService.remove(blog.postId);
    if (!deletedBlog) {
      throw new BadRequestException('Blog not deleted');
    }

    return deletedBlog;
  }

  @Post('like')
  async like(@Body() blog: BlogDto) {
    const likedBlog = await this.blogService.like(blog.postId);

    if (!likedBlog) {
      throw new BadRequestException('Blog not liked');
    }

    return likedBlog;
  }
}

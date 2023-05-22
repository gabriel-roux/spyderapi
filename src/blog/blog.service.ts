import { PrismaService } from 'src/database/prisma.service';
import { BlogDto } from './dtos/blog.dto';

import { Blog } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService {
  constructor(private prismaService: PrismaService) {}

  async findAll(limit: number, page: number): Promise<Blog[]> {
    const blogs = await this.prismaService.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
      skip: Number(page - 1) * Number(limit),
    });

    return blogs;
  }

  async findOne(id: string) {
    return await this.prismaService.blog.findUnique({
      where: {
        id,
      },
    });
  }

  async create(image: string, title: string, content: string) {
    const post = await this.prismaService.blog.create({
      data: {
        title,
        content,
        image,
        likes: 0,
      },
    });

    return post;
  }

  async update(data: BlogDto) {
    return await this.prismaService.blog.update({
      where: {
        id: data.postId,
      },
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
      },
    });
  }

  async remove(id: string) {
    return await this.prismaService.blog.delete({
      where: {
        id,
      },
    });
  }

  async like(id: string) {
    return await this.prismaService.blog.update({
      where: {
        id,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }
}

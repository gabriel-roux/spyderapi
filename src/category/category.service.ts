import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(name: string, slug: string) {
    return await this.prismaService.category.create({
      data: {
        name,
        slug,
      },
    });
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories;
  }

  async findOne(slug: string) {
    return await this.prismaService.category.findUnique({
      where: {
        slug,
      },
    });
  }

  async update(name: string, slug: string) {
    return await this.prismaService.category.update({
      where: {
        slug,
      },
      data: {
        name,
      },
    });
  }

  async remove(slug: string) {
    return await this.prismaService.category.delete({
      where: {
        slug,
      },
    });
  }
}

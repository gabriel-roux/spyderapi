import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('getAll')
  async getAll() {
    console.log('get all');
    const categories = await this.categoryService.findAll();

    if (!categories) {
      throw new NotFoundException('Categories not found');
    }

    return categories;
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('slug') slug: string) {
    const category = await this.categoryService.findOne(slug);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() category: CategoryDto) {
    const { name, slug } = category;

    console.log(name, slug);
    const newCategory = await this.categoryService.create(name, slug);

    if (!newCategory) {
      throw new BadRequestException('Category not created');
    }

    return newCategory;
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async update(@Body() category: CategoryDto) {
    const { name, slug } = category;

    const updatedCategory = await this.categoryService.update(name, slug);

    if (!updatedCategory) {
      throw new BadRequestException('Category not updated');
    }

    return updatedCategory;
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Body() category: CategoryDto) {
    const { slug } = category;

    await this.categoryService.remove(slug);

    return {
      message: 'Category deleted',
      status: 200,
    };
  }
}

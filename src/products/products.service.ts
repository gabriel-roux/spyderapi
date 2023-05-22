import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async createProduct(
    productId: string,
    name: string,
    description: string,
    price: number,
    category: string,
    image: string,
  ) {
    const product = await this.prismaService.product.create({
      data: {
        id: productId,
        name,
        description,
        price: Number(price),
        category,
        image,
      },
    });

    return product;
  }

  async updateProduct(
    productId: string,
    name: string,
    description: string,
    price: number,
    category: string,
  ) {
    const product = await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price: Number(price),
        category,
      },
    });

    return product;
  }

  async deleteProduct(productId: string) {
    const product = await this.prismaService.product.delete({
      where: {
        id: productId,
      },
    });

    return product;
  }

  async getAllProducts() {
    const products = await this.prismaService.product.findMany();

    return products;
  }

  async getProductById(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  }
}

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateProductMessage } from './dtos/create-product';
import { ProductService } from './products.service';
import { diskStorage } from 'multer';

const multerConfig = {
  storage: diskStorage({
    destination: process.cwd() + '/uploads',
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${randomUUID()}.${fileExt}`);
    },
  }),
};

@Controller('product')
export class ProductsController {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    private productService: ProductService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createProduct(
    @UploadedFile() image,
    @Body() body: CreateProductMessage,
  ) {
    const { name, description, price, category } = body;

    // Criar produto no Stripe
    const stripeProduct = await this.stripe.products.create({
      name,
      description,
      images: [`https://spyder-team.herokuapp.com/${image.filename}`],
    });

    const product = await this.productService.createProduct(
      stripeProduct.id,
      name,
      description,
      price,
      category,
      image.filename,
    );

    if (!product) {
      throw new Error('Error creating product');
    }

    return {
      message: 'Product created successfully',
      status: 200,
    };
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateProduct(
    @Body() body: CreateProductMessage,
    @UploadedFile() image?,
  ) {
    const { name, description, price, category, productId } = body;

    // Atualizar produto no Stripe
    const stripeData = image
      ? {
          name,
          description,
          images: [image.filename],
        }
      : {
          name,
          description,
        };

    const stripeProduct = await this.stripe.products.update(
      productId,
      stripeData,
    );

    const product = await this.productService.updateProduct(
      stripeProduct.id,
      name,
      description,
      price,
      category,
    );

    if (!product) {
      throw new Error('Error updating product');
    }

    return {
      message: 'Product updated successfully',
      status: 200,
    };
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Body() body: CreateProductMessage) {
    const { productId } = body;

    // Deletar produto no Stripe
    await this.stripe.products.del(productId);

    const product = await this.productService.deleteProduct(productId);

    if (!product) {
      throw new Error('Error deleting product');
    }

    return {
      message: 'Product deleted successfully',
      status: 200,
    };
  }

  @Get('/get/:id')
  async getProductById(@Param('id') productId: string) {
    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new Error('Error getting product');
    }

    return product;
  }

  @Get('get-all')
  async getAllProducts() {
    const products = await this.productService.getAllProducts();

    if (!products) {
      throw new Error('Error getting products');
    }

    return products;
  }
}

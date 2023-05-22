import { Module } from '@nestjs/common';
import { StripeProvider } from 'src/config/stripe.provider';
import { PrismaModule } from 'src/database/prisma.module';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [StripeProvider, ProductService],
})
export class ProductsModule {}

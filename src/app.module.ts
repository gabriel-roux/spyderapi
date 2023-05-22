import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { CouponModule } from './coupons/coupon.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { StripeModule } from './stripe/stripe.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductsModule,
    StripeModule,
    OrdersModule,
    CategoryModule,
    BlogModule,
    CouponModule,
  ],
})
export class AppModule {}

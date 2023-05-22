import { Module } from '@nestjs/common';
import { StripeProvider } from 'src/config/stripe.provider';
import { PrismaModule } from 'src/database/prisma.module';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [PrismaModule],
  controllers: [CouponController],
  providers: [StripeProvider, CouponService],
})
export class CouponModule {}

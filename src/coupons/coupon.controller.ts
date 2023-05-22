import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import Stripe from 'stripe';
import { CouponService } from './coupon.service';
import { CouponDto } from './dto/coupons';

@Controller('coupons')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    @Inject('STRIPE') private readonly stripe: Stripe,
  ) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listCoupons() {
    const coupons = await this.couponService.listCoupons();

    if (coupons.length > 0) {
      return coupons;
    } else {
      throw new NotFoundException('No coupons found');
    }
  }

  @Get(':couponId')
  async retrieveCoupon(@Param('couponId') couponId: string) {
    const coupon = await this.couponService.retrieveCoupon(couponId);

    if (coupon) {
      return coupon;
    } else {
      throw new NotFoundException('Coupon not found');
    }
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createCoupon(@Body() body: CouponDto) {
    console.log(body);

    const response = await this.couponService.createCoupon(body);

    if (response) {
      const expirateAtTimestamp = new Date(body.expirateAt).getTime() / 1000;

      const coupon = await this.stripe.coupons.create({
        name: body.name,
        duration: 'forever',
        percent_off: body.discount,
        currency: 'brl', // Defina a moeda apropriada
        id: body.code,
        redeem_by: expirateAtTimestamp,
      });

      return coupon;
    } else {
      throw new NotFoundException('Coupon not found');
    }
  }

  @Post('update/:couponId')
  @UseGuards(JwtAuthGuard)
  async updateCoupon(
    @Param('couponId') couponId: string,
    @Body() body: CouponDto,
  ) {
    const response = await this.couponService.updateCoupon(couponId, body);

    if (response) {
      const updatedCouponData = {
        name: body.name,
      };

      const coupon = await this.stripe.coupons.update(
        couponId,
        updatedCouponData,
      );

      return coupon;
    } else {
      throw new NotFoundException('Coupon not found');
    }
  }

  @Post('delete/:couponId')
  @UseGuards(JwtAuthGuard)
  async deleteCoupon(@Param('couponId') couponId: string) {
    await this.couponService.deleteCoupon(couponId);

    await this.stripe.coupons.del(couponId);

    return {
      message: 'Coupon deleted',
      status: 200,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CouponDto } from './dto/coupons';

@Injectable()
export class CouponService {
  constructor(private prismaService: PrismaService) {}

  async listCoupons() {
    return this.prismaService.coupon.findMany();
  }

  async retrieveCoupon(couponId: string) {
    return this.prismaService.coupon.findUnique({
      where: {
        id: couponId,
      },
    });
  }

  async createCoupon(body: CouponDto) {
    console.log(body.expirateAt);

    return this.prismaService.coupon.create({
      data: {
        name: body.name,
        code: body.code,
        expirateAt: new Date(body.expirateAt),
        discount: Number(body.discount),
      },
    });
  }

  async updateCoupon(couponId: string, body: CouponDto) {
    return this.prismaService.coupon.update({
      where: {
        code: couponId,
      },
      data: {
        name: body.name,
      },
    });
  }

  async deleteCoupon(couponId: string) {
    return this.prismaService.coupon.delete({
      where: {
        code: couponId,
      },
    });
  }
}

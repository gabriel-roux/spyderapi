import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async update(
    orderId: string,
    status: string,
    shippingStatus: string,
    trackingCode: string,
  ): Promise<boolean> {
    const order = await this.prismaService.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
        shippingStatus,
        trackingCode,
      },
    });

    return !!order;
  }

  async getAll(limit: number, page: number) {
    const orders = await this.prismaService.order.findMany({
      include: {
        products: {
          include: {
            Product: true,
          },
        },
        Address: true,
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    return orders;
  }

  async getOrdersByUser(userEmail: string) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userEmail: userEmail,
      },
      include: {
        products: {
          include: {
            Product: true,
          },
        },
        Address: true,
      },
    });

    return orders;
  }

  async getOne(orderId: string) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        products: {
          include: {
            Product: true,
          },
        },
        Address: true,
        User: true,
      },
    });

    return order;
  }
}

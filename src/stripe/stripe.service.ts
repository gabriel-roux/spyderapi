import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

interface OrderData {
  id: string;
  userEmail: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}

@Injectable()
export class StripeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(order: OrderData): Promise<boolean> {
    try {
      await this.prismaService.order.create({
        data: {
          id: order.id,
          status: 'not-processed',
          userEmail: order.userEmail,
          products: {
            create: [
              ...order.products.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
                orderId: '',
              })),
            ],
          },
        },
        include: {
          products: true,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async updateOrder(order: any, shipping: any) {
    try {
      const address = shipping
        ? await this.prismaService.address.create({
            data: {
              street: shipping.address.line1,
              city: shipping.address.city,
              state: shipping.address.state,
              cep: shipping.address.postal_code,
              neighborhood: shipping.address.line2, // Atualize para obter o bairro de acordo com a estrutura do seu objeto shipping
            },
          })
        : null;

      await this.prismaService.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: order.status,
          addressId: address ? address.id : '',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

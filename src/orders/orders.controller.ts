import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateOrderDto } from './dtos/update-order';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  async update(@Body() message: UpdateOrderDto) {
    const { orderId, shippingStatus, status, trackingCode } = message;

    const order = await this.ordersService.update(
      orderId,
      status,
      shippingStatus,
      trackingCode,
    );
    if (!order) {
      throw new BadRequestException('Error updating order');
    }

    return {
      status: 200,
      message: 'Order updated successfully',
    };
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getOrdersByUser(@Query('userEmail') userEmail: string) {
    const orders = await this.ordersService.getOrdersByUser(userEmail);
    if (!orders) {
      throw new BadRequestException('Error getting orders');
    }

    return {
      status: 200,
      orders,
    };
  }

  // Dentro do seu controller
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAll(@Query('limit') limit: number, @Query('page') page: number) {
    const orders = await this.ordersService.getAll(limit, page);
    if (!orders) {
      throw new BadRequestException('Error getting orders');
    }

    return {
      status: 200,
      orders,
    };
  }

  @Get('/:orderId')
  async getOne(@Param('orderId') orderId: string) {
    const order = await this.ordersService.getOne(orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return {
      status: 200,
      order,
    };
  }
}

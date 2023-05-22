import { IsString, IsUUID } from 'class-validator';

export class UpdateOrderDto {
  @IsUUID()
  orderId: string;

  @IsString()
  trackingCode: string;

  @IsString()
  status: string;

  @IsString()
  shippingStatus: string;
}

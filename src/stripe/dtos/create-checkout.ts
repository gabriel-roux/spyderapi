import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateCheckoutDto {
  @IsArray()
  @IsNotEmpty()
  cartItems: string;

  @IsString()
  @IsNotEmpty()
  coupon: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

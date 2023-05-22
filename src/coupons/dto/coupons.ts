import { IsNumber, IsString } from 'class-validator';

export class CouponDto {
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsNumber()
  discount: number;

  @IsString()
  expirateAt: string;
}

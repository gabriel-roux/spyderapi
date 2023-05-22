import { Module } from '@nestjs/common';
import { StripeProvider } from 'src/config/stripe.provider';
import { PrismaModule } from 'src/database/prisma.module';
import { CheckoutController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [PrismaModule],
  controllers: [CheckoutController],
  providers: [StripeProvider, StripeService],
})
export class StripeModule {}

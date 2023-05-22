import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Stripe } from 'stripe';
import { CreateCheckoutDto } from './dtos/create-checkout';
import { StripeService } from './stripe.service';

@Controller('checkout')
export class CheckoutController {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  async createCheckoutSession(
    @Body() createCheckoutDto: CreateCheckoutDto,
    @Res() res: Response,
  ) {
    const { cartItems, email, coupon } = createCheckoutDto;

    if (!email) return res.redirect(303, 'https://spyderteam.com.br/login');

    const itsCoupon = await this.stripe.coupons.retrieve(coupon);

    const cart = JSON.parse(cartItems);
    console.log(cart);
    // Aqui você deve buscar os detalhes do produto, incluindo o preço, do seu banco de dados usando cartItems.productId
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'brl',
        product: item.productId,
        unit_amount: item.price, // Substitua pelo preço real do produto
      },
      quantity: item.quantity,
    }));

    const productMetadata = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      metadata: {
        items: JSON.stringify(productMetadata),
      },
      discounts: [{ coupon }],
      customer_email: email,
      mode: 'payment',
      success_url: `https://spyderteam.com.br/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://spyderteam.com.br/loja',
    });

    const order = await this.stripeService.createOrder({
      id: session.id,
      userEmail: email,
      products: productMetadata,
    });

    if (!order) {
      res.redirect(303, 'https://spyderteam.com.br/loja');
      return;
    }

    res.redirect(303, session.url);
  }

  @Post('webhook')
  async webhook(
    @Res() res: Response,
    @Req() request: Request,
    @Body() message: any,
  ) {
    const sig = request.headers['stripe-signature'];
    const endpointSecret =
      'whsec_9a39019427fee0ada5eb5df7b1ba45ee39c54a911c7dd37447bf44208f5a12ea';

    // let event;

    // try {
    //   event = await this.stripe.webhooks.constructEvent(
    //     message,
    //     sig,
    //     endpointSecret,
    //   );
    // } catch (err) {
    //   res.status(400).send(`Webhook Error: ${err.message}`);
    //   return;
    // }

    // Handle the event
    switch (message.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(message);
        break;
      // ... handle other event types
      case 'checkout.session.async_payment_succeeded':
        await this.handleAsyncPaymentSucceeded(message);
        break;

      case 'checkout.session.async_payment_failed':
        // Lide com a falha do pagamento assíncrono (por exemplo, boleto)
        this.handleAsyncPaymentFailed(message);
        break;

      // case 'charge.refunded':
      //   // Lide com reembolsos
      //   this.handleRefund(event);
      //   break;
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  }

  async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const checkoutSessionId = session.id;
    const paymentIntentId = session.payment_intent;

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      String(paymentIntentId),
      {
        expand: ['shipping'],
      },
    );

    // Extraia os detalhes de envio
    const shipping = paymentIntent.shipping;
    const order = {
      id: checkoutSessionId,
      status: 'succeeded',
    };

    // Chame a função registerNewOrder para armazenar os pedidos
    await this.stripeService.updateOrder(order, shipping);
  }

  async handleAsyncPaymentSucceeded(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const checkoutSessionId = session.id;
    const paymentIntentId = session.payment_intent;

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      String(paymentIntentId),
      {
        expand: ['shipping'],
      },
    );

    // Extraia os detalhes de envio
    const shipping = paymentIntent.shipping;
    const order = {
      id: checkoutSessionId,
      status: 'succeeded',
    };

    // Chame a função registerNewOrder para armazenar os pedidos
    await this.stripeService.updateOrder(order, shipping);
  }

  async handleAsyncPaymentFailed(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const checkoutSessionId = session.id;

    // Update the order as failed in your database

    const order = {
      id: checkoutSessionId,
      status: 'failed',
    };

    // Chame a função updateOrder para armazenar os pedidos
    await this.stripeService.updateOrder(order, {});
  }

  async handleRefund(event: Stripe.Event): Promise<void> {
    //  const charge = event.data.object as Stripe.Charge;
    // const paymentIntentId = charge.;
    // Update the order as refunded in your database
    // ...
  }
}

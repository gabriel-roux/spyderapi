import { Provider } from '@nestjs/common';
import { Stripe } from 'stripe';

export const StripeProvider: Provider = {
  provide: 'STRIPE',
  useFactory: (): Stripe => {
    return new Stripe(
      'sk_test_51MlwjuAH9Hp2qLliVvXz5RmrHLQC0zA73eIMsZyBdoC6CnFJFUp66eFfYsxOAQohiS5Gk3czNHapIr7UpVgXi8nL00UGpS5MgN',
      {
        apiVersion: '2022-11-15',
      },
    );
  },
};

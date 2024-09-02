import { beforeAll } from '@jest/globals';
import { it } from '@jest/globals';
import { describe } from '@jest/globals';
import Stripe from 'stripe';
import { createPaymentIntents } from '.';
import { MockserverDriver } from '../drivers/mock-server.driver';
import { createPaymentIntentsResponseBody } from '../mock-data/payment-intents-response.mock-data';
import { expect } from '@jest/globals';

describe('paymentIntents', () => {
  let mockserverDriver: MockserverDriver;
  let stripe: Stripe;

  beforeAll(() => {
    const { STRIPE_SECRET_KEY } = process.env;
    const stripeConfig: Stripe.StripeConfig = {
      apiVersion: '2024-06-20',
      telemetry: false,
      host: 'localhost',
      port: 1080,
      protocol: 'http',
    };

    mockserverDriver = new MockserverDriver();
    stripe = new Stripe(STRIPE_SECRET_KEY, stripeConfig);
  });
  // afterEach(async () => await mockserverDriver.cleanup());

  it('should create a payment intents', async () => {
    const mockResponseBody = createPaymentIntentsResponseBody(12222);
    await mockserverDriver.mockResponse({
      httpRequest: {
        method: 'POST',
        path: '/v1/payment_intents',
      },
      httpResponse: {
        statusCode: 200,
        body: mockResponseBody,
      },
    });

    const id = await createPaymentIntents(
      stripe,
      12222,
      'pm_card_unionpay',
    );

    expect(
      await mockserverDriver.verifyRequestWasReceived({
        method: 'POST',
        path: '/v1/payment_intents',
      }),
    ).toBeTruthy();
    expect(id).toBe(mockResponseBody.id);
  });
});

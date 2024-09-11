import Stripe from 'stripe';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_KEY: string;
    }
  }
}

export async function createPaymentIntents(
  stripe: Stripe,
  amount: number,
  token: string,
) {
  const { id } = await stripe.paymentIntents
    .create({
      amount,
      confirm: true,
      currency: 'JPY',
      payment_method: token,
      return_url: 'https://example.cn',
    })
    .catch((e) => {
      console.dir(e, { depth: null });
      throw e;
    });

  return id;
}

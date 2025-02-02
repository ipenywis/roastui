import stripe from './stripe';

export const TIERS: { [key: string]: string } = {
  starter: 'starter',
  pro: 'pro',
};

export const PLANS: { [key: string]: string } = {
  monthly: 'monthly',
  yearly: 'yearly',
};

export const LOOKUP_KEYS: { [key: string]: { [key: string]: string } } = {
  starter: {
    monthly: 'roastui_starter_monthly',
    yearly: 'roastui_starter_yearly',
  },
  pro: {
    monthly: 'roastui_pro_monthly',
    yearly: 'roastui_pro_yearly',
  },
};

export async function getCheckoutUrl(
  userId: string,
  tier: string,
  plan: string,
): Promise<string | null> {
  if (!tier || !plan) {
    throw new Error('Missing tier or plan');
  }

  if (!TIERS[tier] || !PLANS[plan]) {
    throw new Error('Invalid tier or plan');
  }

  const lookupKey = LOOKUP_KEYS[tier][plan];

  const price = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: price.data[0].id,
        quantity: 1,
      },
    ],
    billing_address_collection: 'auto',
    success_url: `${process.env.APP_URL}/playground`,
    cancel_url: `${process.env.APP_URL}`,
    metadata: {
      userId,
      tier,
      plan,
    },
  });

  return session.url;
}

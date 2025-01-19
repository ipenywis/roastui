import { auth } from '@/auth';
import { getCheckoutUrl } from '@/lib/payment';
import { Checkout } from '@/types/checkout';
import { NextResponse } from 'next/server';

export const POST = auth(async (request) => {
  const { auth } = request;

  const { tier, plan } = await request.json();

  if (!auth || !auth.user || !auth.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const checkoutUrl = await getCheckoutUrl(auth.user.id, tier, plan);

    if (!checkoutUrl) {
      return new Response('Failed to create checkout session', { status: 500 });
    }

    return NextResponse.json<Checkout>({ checkoutUrl });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
});

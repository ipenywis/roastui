import { prisma } from '@/lib/prisma';
import stripe from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();

  const signature = request.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    return new Response('Not authorized!', { status: 401 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const tier = checkoutSession.metadata?.tier;
        const plan = checkoutSession.metadata?.plan;
        const userId = checkoutSession.metadata?.userId;

        if (!tier || !plan || !userId) {
          return new Response('Missing tier, plan, or user ID', {
            status: 400,
          });
        }

        const subscription = await prisma.subscription.create({
          data: {
            userId,
            plan,
            tier,
            credits: 100,
            isActive: true,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionId: {
              connect: {
                id: subscription.id,
              },
            },
          },
        });

        //eslint-disable-next-line no-console
        console.log('Subscription created and user updated', subscription);

        return NextResponse.json({ message: 'Session checkout completed' });

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription;

        const customer = (await stripe.customers.retrieve(
          subscriptionDeleted.customer as string,
        )) as Stripe.Customer;

        if (!customer?.email)
          return new Response('Something went wrong!', { status: 500 });

        const user = await prisma.user.findUnique({
          where: { email: customer.email },
          include: {
            subscriptionId: true,
          },
        });

        if (!user || !user.subscriptionId) {
          return new Response('User not found', { status: 500 });
        }

        await prisma.subscription.delete({
          where: { id: user.subscriptionId.id },
        });

        return NextResponse.json({ message: 'Subscription deleted' });
      default:
        return NextResponse.json(
          { message: 'Unknown event type' },
          { status: 404 },
        );
    }
  } catch (err) {
    return new Response('Webhook error', { status: 400 });
  }
}

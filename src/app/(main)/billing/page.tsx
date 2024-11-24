import { auth } from '@/auth';
import stripe from '@/lib/stripe';
import { redirect } from 'next/navigation';

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user || !session?.user?.email) {
    redirect('/login');
  }

  const { data: customers } = await stripe.customers.list({
    email: session.user.email,
    limit: 1,
  });

  let redirectUrl = '';

  try {
    const billingPortalSession = await stripe.billingPortal.sessions.create({
      customer: customers[0].id,
      return_url: `${process.env.APP_URL}`,
    });

    if (!billingPortalSession.url) {
      return <div>Something went wrong! Please try again.</div>;
    }

    console.log('billingPortalSession.url', billingPortalSession.url);
    redirectUrl = billingPortalSession.url;
  } catch (err) {
    console.error('Error:', err);
    return <div>Something went wrong! Please try again.</div>;
  } finally {
    console.log('finally');
    return redirect(redirectUrl);
  }
}

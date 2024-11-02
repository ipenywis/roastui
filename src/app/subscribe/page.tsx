import { auth } from '@/auth';
import { getCheckoutUrl } from '@/lib/payment';
import { prisma } from '@/lib/prisma';
import paymentService from '@/services/paymentService';
import { redirect } from 'next/navigation';

export default async function Subscribe({
  searchParams,
}: {
  searchParams: { plan?: string; tier?: string };
}) {
  const session = await auth();

  console.log('searchParams', searchParams);

  if (!session?.user || !session?.user?.id) return redirect('/login');

  if (!searchParams?.tier || !searchParams?.plan) return redirect('/pricing');

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user?.id },
  });

  if (subscription?.isActive) return redirect('/dashboard');
  else if (subscription?.isActive) {
    //TODO: redirect to stripe customer portal if subscription is cancelled
    console.log('TODO: redirect to stripe customer portal');
    return redirect('/dashboard');
  } else {
    const checkoutUrl = await getCheckoutUrl(
      session.user.id,
      searchParams.tier,
      searchParams.plan
    );

    if (!checkoutUrl) {
      return (
        <span className="text-red-500">Cannot process checkout request!</span>
      );
    }

    return redirect(checkoutUrl);
  }
}

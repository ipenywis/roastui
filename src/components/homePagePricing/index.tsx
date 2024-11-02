import { auth } from '@/auth';
import { Pricing } from '../pricing';
import { prisma } from '@/lib/prisma';

export async function HomePagePricing() {
  const session = await auth();

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session?.user?.id },
  });

  return <Pricing mode="integrated" subscription={subscription || undefined} />;
}

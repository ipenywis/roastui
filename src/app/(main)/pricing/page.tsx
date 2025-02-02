import { auth } from '@/auth';
import { Pricing } from '@/components/pricing';
import { prisma } from '@/lib/prisma';

export default async function PricingPage() {
  const session = await auth();

  const subscription = await prisma.subscription.findFirst({
    where: { userId: session?.user?.id },
  });

  return (
    <div className="flex flex-col size-full items-center justify-center">
      <Pricing
        className="mb-0 mt-32"
        mode="standalone"
        subscription={subscription || undefined}
      />
    </div>
  );
}

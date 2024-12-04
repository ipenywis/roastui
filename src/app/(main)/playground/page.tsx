import { auth } from '@/auth';
import Playground from '@/components/playground';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function DesignPlayground() {
  console.log('Here!');

  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      subscriptionId: true,
    },
  });

  const isActive = user?.subscriptionId?.isActive;

  if (!isActive) return redirect('/subscribe');

  return (
    <div className="size-full">
      <Playground />
    </div>
  );
}

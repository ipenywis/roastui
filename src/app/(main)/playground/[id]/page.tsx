import Playground from '@/components/playground';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function SingleDesignPlayground({
  params,
}: {
  params: { id: string };
}) {
  const roastedDesign = await prisma.roastedDesigns.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!roastedDesign) {
    return notFound();
  }

  return <Playground initialRoastedDesign={roastedDesign} />;
}

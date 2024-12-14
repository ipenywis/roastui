import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PreviewView } from '@/components/previewView';

export default async function IFramePreviewPage(props: {
  params: { designId: string };
}) {
  const { designId } = props.params;

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  const roastedDesign = await prisma.roastedDesigns.findUnique({
    where: {
      id: designId,
    },
  });

  if (!roastedDesign) {
    return notFound();
  }

  return <PreviewView roastedDesign={roastedDesign} />;
}

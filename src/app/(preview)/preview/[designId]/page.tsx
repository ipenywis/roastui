import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import {
  ImprovementsHighlights,
  UiHighlightsControls,
} from '@/components/uiHighlights';
import { DesignPreviewStoreProvider } from '@/lib/providers/designPreviewStoreProvider';

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

  return (
    <DesignPreviewStoreProvider>
      <div
        id="preview-root"
        className="size-full flex items-center justify-center relative"
      >
        <UiHighlightsControls />
        <ImprovementsHighlights
          improvements={JSON.parse(roastedDesign.uiHighlights).improvements}
        />
        <div
          id="html-container"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(roastedDesign.improvedHtml),
          }}
        />
      </div>
    </DesignPreviewStoreProvider>
  );
}

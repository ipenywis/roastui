import { usePreviewViewStore } from '@/lib/providers/previewViewStoreProvider';
import { createPreviewRenderer, renderHtml } from '@/lib/render';
import { RoastedDesigns } from '@prisma/client';
import { useEffect, useMemo } from 'react';
import { useIsMounted } from 'usehooks-ts';

interface HtmlRawRendererProps {
  roastedDesign: RoastedDesigns;
}

export function HtmlRawRenderer({ roastedDesign }: HtmlRawRendererProps) {
  const previewRenderer = useMemo(
    () => createPreviewRenderer(roastedDesign),
    [roastedDesign],
  );

  const isMounted = useIsMounted();

  const setRenderingStatus = usePreviewViewStore(
    (store) => store.setRenderingStatus,
  );

  useEffect(() => {
    //If this runs then its mounted/rendered successfully
    //So we can set the rendering status to success
    if (isMounted()) {
      setRenderingStatus('success');
    }
  }, [isMounted, setRenderingStatus]);

  return renderHtml(previewRenderer) ?? null;
}

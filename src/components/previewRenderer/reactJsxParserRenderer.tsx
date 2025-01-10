'use client';

import { usePreviewViewStore } from '@/lib/providers/previewViewStoreProvider';
import { createPreviewRenderer, RenderReactJsxParser } from '@/lib/render';
import { RoastedDesigns } from '@prisma/client';
import { useCallback, useEffect, useMemo } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { useIsMounted } from 'usehooks-ts';

interface ReactJsxParserRendererProps {
  roastedDesign: RoastedDesigns;
}

export function ReactJsxParserRenderer({
  roastedDesign,
}: ReactJsxParserRendererProps) {
  const previewRenderer = useMemo(
    () => createPreviewRenderer(roastedDesign),
    [roastedDesign],
  );

  const isMounted = useIsMounted();

  const { showBoundary } = useErrorBoundary();

  const setRenderingStatus = usePreviewViewStore(
    (store) => store.setRenderingStatus,
  );

  const handleError = useCallback(
    (error: Error) => {
      setRenderingStatus('error');
      showBoundary(error);
    },
    [showBoundary, setRenderingStatus],
  );

  useEffect(() => {
    //If this runs then its mounted/rendered successfully
    //So we can set the rendering status to success
    if (isMounted()) {
      setRenderingStatus('success');
    }
  }, [isMounted, setRenderingStatus]);

  return (
    <RenderReactJsxParser renderer={previewRenderer} onError={handleError} />
  );
}

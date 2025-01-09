'use client';

import { createPreviewRenderer, RenderReactJsxParser } from '@/lib/render';
import { RoastedDesigns } from '@prisma/client';
import { useMemo } from 'react';

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

  return <RenderReactJsxParser renderer={previewRenderer} />;
}

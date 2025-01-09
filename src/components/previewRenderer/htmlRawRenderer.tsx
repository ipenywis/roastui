import { createPreviewRenderer, renderHtml } from '@/lib/render';
import { RoastedDesigns } from '@prisma/client';
import { useMemo } from 'react';

interface HtmlRawRendererProps {
  roastedDesign: RoastedDesigns;
}

export function HtmlRawRenderer({ roastedDesign }: HtmlRawRendererProps) {
  const previewRenderer = useMemo(
    () => createPreviewRenderer(roastedDesign),
    [roastedDesign],
  );

  return renderHtml(previewRenderer) ?? null;
}

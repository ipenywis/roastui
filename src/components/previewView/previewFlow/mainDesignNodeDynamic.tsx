'use client';

import { RoastedDesigns } from '@prisma/client';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactEsbuildRenderer } from '@/components/previewRenderer/reactEsbuildRenderer';
import { ReactJsxParserRenderer } from '@/components/previewRenderer/reactJsxParserRenderer';
import { HtmlRawRenderer } from '@/components/previewRenderer/htmlRawRenderer';

export function MainDesignNodeDynamic({
  data,
}: {
  data: { roastedDesign: RoastedDesigns };
}) {
  const { roastedDesign } = data;

  return (
    <ErrorBoundary fallback={<HtmlRawRenderer roastedDesign={roastedDesign} />}>
      <ErrorBoundary
        fallback={<ReactJsxParserRenderer roastedDesign={roastedDesign} />}
      >
        <ReactEsbuildRenderer roastedDesign={roastedDesign} />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

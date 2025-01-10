'use client';

import { RoastedDesigns } from '@prisma/client';
import { UiHighlightsControls } from '../uiHighlights';
import { PreviewFlow } from './previewFlow';
import { DesignPreviewStoreProvider } from '@/lib/providers/designPreviewStoreProvider';
import { PreviewViewStoreProvider } from '@/lib/providers/previewViewStoreProvider';
import '@xyflow/react/dist/style.css';

interface DesignPreviewPlaygroundProps {
  roastedDesign: RoastedDesigns;
}

export function PreviewView(props: DesignPreviewPlaygroundProps) {
  const { roastedDesign } = props;

  return (
    <DesignPreviewStoreProvider>
      <PreviewViewStoreProvider>
        <div style={{ width: '100vw', height: '100vh' }}>
          <UiHighlightsControls roastedDesign={roastedDesign} />
          <PreviewFlow roastedDesign={roastedDesign} />
        </div>
      </PreviewViewStoreProvider>
    </DesignPreviewStoreProvider>
  );
}

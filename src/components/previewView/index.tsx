'use client';

import { RoastedDesigns } from '@prisma/client';
import { UiHighlightsControls } from '../uiHighlights';
import { PreviewFlow } from './previewFlow';
import { DesignPreviewStoreProvider } from '@/lib/providers/designPreviewStoreProvider';
import {
  PreviewViewStoreProvider,
  usePreviewViewStore,
} from '@/lib/providers/previewViewStoreProvider';
import '@xyflow/react/dist/style.css';
import { DesingPreviewLoadingOverlay } from '../designPreviewLoading';
import './style.css';

interface DesignPreviewPlaygroundProps {
  roastedDesign: RoastedDesigns;
}

function View({ roastedDesign }: DesignPreviewPlaygroundProps) {
  const renderingStatus = usePreviewViewStore((store) => store.renderingStatus);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {(renderingStatus === 'pending' || renderingStatus === 'idle') && (
        <DesingPreviewLoadingOverlay text="Rendering Design" />
      )}
      <UiHighlightsControls roastedDesign={roastedDesign} />
      <PreviewFlow roastedDesign={roastedDesign} />
    </div>
  );
}

export function PreviewView(props: DesignPreviewPlaygroundProps) {
  return (
    <DesignPreviewStoreProvider>
      <PreviewViewStoreProvider>
        <View {...props} />
      </PreviewViewStoreProvider>
    </DesignPreviewStoreProvider>
  );
}

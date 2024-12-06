'use client';

import { RoastedDesigns } from '@prisma/client';
import { UiHighlightsControls } from '../uiHighlights';
import { useEffect, useState } from 'react';

import '@xyflow/react/dist/style.css';
import {
  getCoordinatesFromElements,
  getHighlightedPreviewElements,
  PreviewHighlightCoordinates,
} from '@/lib/preview';
import { PreviewFlow } from './previewFlow';
import { DesignPreviewStoreProvider } from '@/lib/providers/designPreviewStoreProvider';
import { usePreviewFullScreenMode } from '@/hooks/usePreviewFullScreenMode';

interface DesignPreviewPlaygroundProps {
  roastedDesign: RoastedDesigns;
}

export function PreviewView(props: DesignPreviewPlaygroundProps) {
  const { roastedDesign } = props;

  const [coordinates, setCoordinates] = useState<PreviewHighlightCoordinates[]>(
    []
  );

  const { isPreviewFullScreenMode } = usePreviewFullScreenMode();

  useEffect(() => {
    //Timeout is needed to allow html to paint before getting coordinates
    setTimeout(() => {
      const elements = getHighlightedPreviewElements(
        JSON.parse(roastedDesign.uiHighlights).improvements
      );
      const newCoordinates = getCoordinatesFromElements(elements);
      setCoordinates(newCoordinates);
    }, 100);
  }, [roastedDesign.uiHighlights, isPreviewFullScreenMode]);

  return (
    <DesignPreviewStoreProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <UiHighlightsControls />
        <PreviewFlow
          roastedDesign={roastedDesign}
          arrowsCoordinates={coordinates}
        />
      </div>
    </DesignPreviewStoreProvider>
  );
}

'use client';

import { DesignPreviewStoreProvider } from '@/lib/providers/designPreviewStoreProvider';
import { RoastedDesigns } from '@prisma/client';
import { ImprovementsHighlights, UiHighlightsControls } from '../uiHighlights';
import { useEffect, useState } from 'react';

import '@xyflow/react/dist/style.css';
import {
  getCoordinatesFromElements,
  getHighlightedPreviewElements,
  PreviewHighlightCoordinates,
} from '@/lib/preview';
import { PreviewFlow } from './previewFlow';

interface DesignPreviewPlaygroundProps {
  roastedDesign: RoastedDesigns;
}

export function PreviewView(props: DesignPreviewPlaygroundProps) {
  const { roastedDesign } = props;

  const [coordinates, setCoordinates] = useState<PreviewHighlightCoordinates[]>(
    []
  );

  useEffect(() => {
    const elements = getHighlightedPreviewElements(
      JSON.parse(roastedDesign.uiHighlights).improvements
    );
    const newCoordinates = getCoordinatesFromElements(elements);
    setCoordinates(newCoordinates);
  }, [roastedDesign.uiHighlights]);

  return (
    <DesignPreviewStoreProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <UiHighlightsControls />
        <ImprovementsHighlights
          improvements={JSON.parse(roastedDesign.uiHighlights).improvements}
        />
        <PreviewFlow
          roastedDesign={roastedDesign}
          arrowsCoordinates={coordinates}
        />
      </div>
    </DesignPreviewStoreProvider>
  );
}

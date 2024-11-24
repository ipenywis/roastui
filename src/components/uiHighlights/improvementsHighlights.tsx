'use client';

import { UiHighlights } from '@/types/newDesign';
import { PointingArrow } from '../pointingArrow';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { useEffect, useState } from 'react';
import {
  getCoordinatesFromElements,
  getHighlightedPreviewElements,
  PreviewHighlightCoordinates,
} from '@/lib/preview';

interface ImprovementsHighlightsProps {
  improvements: UiHighlights['improvements'];
}

export function ImprovementsHighlights(props: ImprovementsHighlightsProps) {
  const { improvements } = props;
  const [coordinates, setCoordinates] = useState<PreviewHighlightCoordinates[]>(
    []
  );

  const isImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.isImprovementsHighlightActive
  );

  useEffect(() => {
    const elements = getHighlightedPreviewElements(improvements);
    const newCoordinates = getCoordinatesFromElements(elements);
    setCoordinates(newCoordinates);
  }, [improvements]);

  if (!isImprovementsHighlightActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {coordinates.map((coordinate, index) => (
        <PointingArrow
          key={index}
          start={coordinate.start}
          end={coordinate.end}
          color="#FF5733"
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

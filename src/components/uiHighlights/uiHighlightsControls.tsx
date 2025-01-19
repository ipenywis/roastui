'use client';

import { RoastedDesigns } from '@prisma/client';
import { ControlsMenu } from './controlsMenu';

interface UiHighlightsControlsProps {
  roastedDesign: RoastedDesigns;
}

export function UiHighlightsControls(props: UiHighlightsControlsProps) {
  const { roastedDesign } = props;

  return (
    <div className="absolute bottom-5 right-4 z-[9999] h-10">
      <ControlsMenu roastedDesign={roastedDesign} />
    </div>
  );
}

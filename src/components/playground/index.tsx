'use client';

import { RoastedDesigns } from '@prisma/client';
import { StreamingPlayground } from './streamingPlayground';
import { useEffect } from 'react';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { loadEsbuild } from '@/lib/bundler';
import { ControlsMenu } from '../uiHighlights/controlsMenu';

interface PlaygroundProps {
  initialRoastedDesign?: RoastedDesigns;
}

export default function Playground(props: PlaygroundProps) {
  const { initialRoastedDesign } = props;

  const setCurrentRoastedDesign = useDesignPreviewStore(
    (state) => state.setCurrentRoastedDesign,
  );

  useEffect(() => {
    if (initialRoastedDesign) {
      setCurrentRoastedDesign(initialRoastedDesign);
    }
  }, [initialRoastedDesign, setCurrentRoastedDesign]);

  //Experimental loading esbuild.wasm before hand
  useEffect(() => {
    loadEsbuild();
  }, []);

  // return <ControlsMenu />;

  return <StreamingPlayground initialRoastedDesign={initialRoastedDesign} />;
}

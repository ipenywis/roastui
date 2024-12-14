'use client';

import { cva } from 'class-variance-authority';
import { Tools } from './tools';
import { Tabs } from '../ui/tabs';
import { ImprovedDesignTab } from './improvedDesignTab';
import { OriginalDesignTab } from './originalDesignTab';
import { ImprovedHtmlSandpackTab } from './improvedHtmlSandpackTab';
import { UiHighlights } from '@/types/newDesign';
import useLocalStorageState from 'use-local-storage-state';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePreviewFullScreenMode } from '@/hooks/usePreviewFullScreenMode';

const container = cva(
  'flex flex-col justify-center items-center mt-10 relative border border-gray-600 rounded-lg overflow-hidden',
  {
    variants: {
      fullScreen: {
        true: 'w-full h-full !mt-0 p-0',
        false: 'w-[1000px] h-[800px]',
      },
    },
    defaultVariants: {
      fullScreen: false,
    },
  },
);

const innerContainer = cva(
  'flex flex-col relative size-full min-w-full min-h-full overflow-hidden border',
);

interface DesignPreviewProps {
  designId?: string;
  HTML?: string;
  react?: string;
  originalImageUrl?: string;
  uiHighlights?: UiHighlights;
}

export function DesignPreview({
  HTML,
  react,
  originalImageUrl,
  designId,
}: DesignPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string>('improvedDesign');

  const { isPreviewFullScreenMode, handleToggleFullScreenMode } =
    usePreviewFullScreenMode();

  useEffect(() => {
    handleToggleFullScreenMode(containerRef.current);
  }, [handleToggleFullScreenMode]);

  useEffect(() => {
    if (designId) setActiveTab('improvedDesign');
    else if (HTML) setActiveTab('improvedHtml');
  }, [designId, HTML, originalImageUrl]);

  if (!HTML) return null;

  return (
    <div
      id="full-screen-preview-container"
      ref={containerRef}
      className="w-full h-full"
    >
      <div className={container({ fullScreen: isPreviewFullScreenMode })}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full"
        >
          <div className={innerContainer()}>
            <Tools
              isImprovedDesignDisabled={!designId}
              isOriginalDesignDisabled={!originalImageUrl}
            />
            {designId && <ImprovedDesignTab designId={designId} />}
            <ImprovedHtmlSandpackTab HTML={HTML} react={react} />
            {originalImageUrl && (
              <OriginalDesignTab originalImageUrl={originalImageUrl} />
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

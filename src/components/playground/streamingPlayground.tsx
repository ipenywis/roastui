import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { container, innerContainer, title } from './common';
import { DeepPartial } from 'ai';
import { DesignPreview } from '../designPreview';
import { useState, useEffect, useMemo } from 'react';
import { TypewriterQueue } from '../ui/typewriter-queue';
import { DesignImprovementsPreviewStreaming } from '../designImprovementsPreviewStreaming';
import { parsePartialJson } from '@ai-sdk/ui-utils';
import { DesignImprovements } from '@/types/designImprovements';

interface StreamingPlaygroundProps {
  streamableRoastedDesign?: DeepPartial<StreamableRoastedDesign>;
}

export function StreamingPlayground({
  streamableRoastedDesign,
}: StreamingPlaygroundProps) {
  const parsedWhatIsWrong = useMemo(() => {
    if (!streamableRoastedDesign?.whatsWrong) return [];

    const { value } = parsePartialJson(streamableRoastedDesign.whatsWrong);
    return value ? (value as DesignImprovements['whatsWrong']) : [];
  }, [streamableRoastedDesign?.whatsWrong]);

  const parsedImprovements = useMemo(() => {
    if (!streamableRoastedDesign?.improvements) return [];

    const { value } = parsePartialJson(streamableRoastedDesign.improvements);
    return value ? (value as DesignImprovements['improvements']) : [];
  }, [streamableRoastedDesign?.improvements]);

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <h1 className={title()}>Roast New Design</h1>
        <div>
          {streamableRoastedDesign?.improvedHtml && (
            <DesignPreview
              HTML={streamableRoastedDesign.improvedHtml}
              designId={streamableRoastedDesign.id}
              originalImageUrl={streamableRoastedDesign.originalImageUrl}
            />
          )}
        </div>
        <div className="space-y-6">
          <DesignImprovementsPreviewStreaming
            whatsWrong={parsedWhatIsWrong}
            improvements={parsedImprovements}
          />
        </div>
      </div>
    </div>
  );
}

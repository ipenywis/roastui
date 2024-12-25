import {
  StreamableRoastedDesign,
  StreamableRoastedDesignsSchema,
} from '@/types/roastedDesign';
import { container, innerContainer } from './common';
import { DesignPreview } from '../designPreview';
import { useCallback, useMemo, useRef, useState } from 'react';
import { DesignImprovementsPreviewStreaming } from '../designImprovementsPreviewStreaming';
import { parsePartialJson } from '@ai-sdk/ui-utils';
import { DesignImprovements } from '@/types/designImprovements';
import { StreamingLoading } from './streamingLoading';
import { StreamingDesignTitle } from './designTitle';
import { FormValues } from '../newDesignForm';
import { useObject } from '@/hooks/useObject';
import roastService from '@/services/roastService';
import { DesignForm } from './designForm';
import { useRoastDesign } from '@/hooks/useRoastDesign';
import { PlaygroundError } from './playgroundError';

// interface StreamingPlaygroundProps {
//   streamableRoastedDesign?: DeepPartial<StreamableRoastedDesign>;
//   isLoading?: boolean;
// }

export function StreamingPlayground() {
  const [roastResponse, setRoastResponse] =
    useState<StreamableRoastedDesign | null>(null);

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const cachedImprovements = useRef<DesignImprovements['improvements']>([]);
  const cachedWhatIsWrong = useRef<DesignImprovements['whatsWrong']>([]);

  const {
    roastNewDesign,
    roastUpdateDesign,
    isCreationLoading,
    isUpdateLoading,
    creationError,
    updateError,
    createdRoastedDesign,
    updatedRoastedDesign,
    lastCreatedDesignFormValues,
    clearCreatedRoastedDesign,
    clearUpdatedRoastedDesign,
    genericError,
    clearGenericError,
  } = useRoastDesign({
    onCreationFinish: (object) => {
      setRoastResponse(object);
    },
    onUpdateFinish: (object) => {
      setRoastResponse(object);
    },
  });

  const streamableRoastedDesign = isUpdateMode
    ? updatedRoastedDesign
    : createdRoastedDesign;

  const isLoading = isUpdateMode ? isUpdateLoading : isCreationLoading;

  const parsedWhatIsWrong = useMemo(() => {
    if (!streamableRoastedDesign?.whatsWrong) return cachedWhatIsWrong.current;

    const { value } = parsePartialJson(streamableRoastedDesign.whatsWrong);
    cachedWhatIsWrong.current = value
      ? (value as DesignImprovements['whatsWrong'])
      : [];
    return value ? (value as DesignImprovements['whatsWrong']) : [];
  }, [streamableRoastedDesign?.whatsWrong]);

  const parsedImprovements = useMemo(() => {
    if (!streamableRoastedDesign?.improvements)
      return cachedImprovements.current;

    const { value } = parsePartialJson(streamableRoastedDesign.improvements);
    cachedImprovements.current = value
      ? (value as DesignImprovements['improvements'])
      : [];
    return value ? (value as DesignImprovements['improvements']) : [];
  }, [streamableRoastedDesign?.improvements]);

  const clearCachedImprovements = useCallback(() => {
    cachedImprovements.current = [];
    cachedWhatIsWrong.current = [];
  }, []);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!streamableRoastedDesign?.id) {
        clearCachedImprovements();
        clearCreatedRoastedDesign();
        await roastNewDesign(values);
      } else {
        clearCachedImprovements();
        clearCreatedRoastedDesign();
        clearUpdatedRoastedDesign();
        setIsUpdateMode(true);
        await roastUpdateDesign(streamableRoastedDesign.id, values);
      }
    },
    [
      roastUpdateDesign,
      roastNewDesign,
      streamableRoastedDesign?.id,
      setIsUpdateMode,
      clearCachedImprovements,
      clearCreatedRoastedDesign,
      clearUpdatedRoastedDesign,
    ],
  );

  const handleRoastAgain = useCallback(() => {
    clearGenericError();
    clearCachedImprovements();
    if (lastCreatedDesignFormValues && roastResponse?.id) {
      setIsUpdateMode(true);
      clearUpdatedRoastedDesign();
      roastUpdateDesign(roastResponse.id, lastCreatedDesignFormValues);
    } else if (!roastResponse?.id && lastCreatedDesignFormValues) {
      clearCreatedRoastedDesign();
      roastNewDesign(lastCreatedDesignFormValues);
    }
  }, [
    lastCreatedDesignFormValues,
    roastResponse?.id,
    roastUpdateDesign,
    clearUpdatedRoastedDesign,
    setIsUpdateMode,
    clearCachedImprovements,
    roastNewDesign,
    clearCreatedRoastedDesign,
    clearGenericError,
  ]);

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <div className="flex items-center flex-col gap-5">
          <StreamingDesignTitle
            name={streamableRoastedDesign?.name}
            disableStreaming={!isLoading}
          />
          {isLoading && <StreamingLoading />}
        </div>
        <DesignForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isStreamingComplete={!!streamableRoastedDesign && !isLoading}
          onRoastAgain={handleRoastAgain}
          isUpdateMode={streamableRoastedDesign?.id ? true : false}
        />
        <PlaygroundError error={genericError || updateError || creationError} />
        {streamableRoastedDesign?.improvedHtml && (
          <DesignPreview
            HTML={streamableRoastedDesign.improvedHtml}
            react={streamableRoastedDesign.improvedReact}
            designId={streamableRoastedDesign.id}
            originalImageUrl={streamableRoastedDesign.originalImageUrl}
          />
        )}
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

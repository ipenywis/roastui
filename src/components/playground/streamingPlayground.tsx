import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { container, innerContainer } from './common';
import { DesignPreview } from '../designPreview';
import { useCallback, useMemo, useRef, useState } from 'react';
import { DesignImprovementsPreviewStreaming } from '../designImprovementsPreviewStreaming';
import { parsePartialJson } from '@ai-sdk/ui-utils';
import { DesignImprovements } from '@/types/designImprovements';
import { StreamingLoading } from './streamingLoading';
import { StreamingDesignTitle } from './designTitle';
import { FormValues } from '../newDesignForm';
import { DesignForm } from './designForm';
import { useRoastDesign } from '@/hooks/useRoastDesign';
import { PlaygroundError } from './playgroundError';
import { RoastedDesigns } from '@prisma/client';

interface StreamingPlaygroundProps {
  initialRoastedDesign?: RoastedDesigns;
}

export function StreamingPlayground(props: StreamingPlaygroundProps) {
  const { initialRoastedDesign } = props;
  const [roastResponse, setRoastResponse] = useState<
    StreamableRoastedDesign | RoastedDesigns | null
  >(initialRoastedDesign ?? null);

  const [isUpdateMode, setIsUpdateMode] = useState(
    initialRoastedDesign ? true : false,
  );

  const cachedImprovements = useRef<DesignImprovements['improvements']>([]);
  const cachedWhatIsWrong = useRef<DesignImprovements['whatsWrong']>([]);

  const {
    roastNewDesign,
    roastUpdateDesign,
    roastUpdateDesignWithValues,
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
    initialRoastedDesign: initialRoastedDesign,
    onCreationFinish: (object) => {
      if (object.id) setRoastResponse(object);
    },
    onUpdateFinish: (object) => {
      if (object.id) setRoastResponse(object);
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
      clearGenericError();
      if (!streamableRoastedDesign?.id) {
        clearCachedImprovements();
        clearCreatedRoastedDesign();
        setIsUpdateMode(false);
        await roastNewDesign(values);
      } else {
        clearCachedImprovements();
        clearCreatedRoastedDesign();
        clearUpdatedRoastedDesign();
        setIsUpdateMode(true);
        await roastUpdateDesignWithValues(streamableRoastedDesign.id, values);
      }
    },
    [
      roastUpdateDesignWithValues,
      roastNewDesign,
      streamableRoastedDesign,
      setIsUpdateMode,
      clearCachedImprovements,
      clearCreatedRoastedDesign,
      clearUpdatedRoastedDesign,
      clearGenericError,
    ],
  );

  const handleRoastAgain = useCallback(() => {
    clearGenericError();
    clearCachedImprovements();
    if (roastResponse?.id && lastCreatedDesignFormValues) {
      setIsUpdateMode(true);
      roastUpdateDesignWithValues(
        roastResponse?.id,
        lastCreatedDesignFormValues,
      );
    } else if (roastResponse?.id) {
      setIsUpdateMode(true);
      clearUpdatedRoastedDesign();
      roastUpdateDesign(roastResponse);
    }
    // else if (!roastResponse?.id && lastCreatedDesignFormValues) {
    //   clearCreatedRoastedDesign();
    //   roastNewDesign(lastCreatedDesignFormValues);
    // }
  }, [
    roastResponse,
    roastUpdateDesign,
    clearUpdatedRoastedDesign,
    setIsUpdateMode,
    clearCachedImprovements,
    clearGenericError,
    roastUpdateDesignWithValues,
    lastCreatedDesignFormValues,
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
            disableTypewriter={!isLoading}
          />
        </div>
      </div>
    </div>
  );
}

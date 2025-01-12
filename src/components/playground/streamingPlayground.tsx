import { StreamableRoastedDesign } from '@/types/roastedDesign';
import { container, innerContainer } from './common';
import { DesignPreview } from '../designPreview';
import { useCallback, useMemo, useRef, useState } from 'react';
import { DesignImprovementsPreviewStreaming } from '../designImprovementsPreviewStreaming';
import { parsePartialJson } from '@ai-sdk/ui-utils';
import { DesignImprovements } from '@/types/designImprovements';
import { StreamingLoading } from './streamingLoading';
import { StreamingDesignTitle } from './designTitle';
import { CreateFormValues, FormValues } from '../newDesignForm';
import { DesignForm } from './designForm';
import { useRoastDesign } from '@/hooks/useRoastDesign';
import { PlaygroundError } from './playgroundError';
import { RoastedDesigns } from '@prisma/client';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { useRouter } from 'next/navigation';
import { GoBackButton } from './goBackButton';

interface StreamingPlaygroundProps {
  initialRoastedDesign?: RoastedDesigns;
}

export function StreamingPlayground(props: StreamingPlaygroundProps) {
  const { initialRoastedDesign } = props;
  const [roastResponse, setRoastResponse] = useState<
    StreamableRoastedDesign | RoastedDesigns | null
  >(initialRoastedDesign ?? null);

  const router = useRouter();

  const [isUpdateMode, setIsUpdateMode] = useState(
    initialRoastedDesign ? true : false,
  );

  const cachedImprovements = useRef<DesignImprovements['improvements']>([]);
  const cachedWhatIsWrong = useRef<DesignImprovements['whatsWrong']>([]);

  const setCurrentRoastedDesign = useDesignPreviewStore(
    (state) => state.setCurrentRoastedDesign,
  );

  const replaceCurrentUrl = useCallback(
    (roastedDesignId: RoastedDesigns['id']) => {
      //Replace without triggering a new navigation (and new page rendering)
      router.replace(`/playground/${roastedDesignId}`);
    },
    [router],
  );

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
      if (object.id) {
        setRoastResponse(object);
        setCurrentRoastedDesign(object);
        replaceCurrentUrl(object.id);
      }
    },
    onUpdateFinish: (object) => {
      if (object.id) {
        setRoastResponse(object);
        setCurrentRoastedDesign(object);
      }
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
        setCurrentRoastedDesign(null);
        setIsUpdateMode(false);
        await roastNewDesign(values);
      } else {
        clearCachedImprovements();
        clearCreatedRoastedDesign();
        clearUpdatedRoastedDesign();
        setCurrentRoastedDesign(null);
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
      setCurrentRoastedDesign,
    ],
  );

  const handleRoastAgain = useCallback(() => {
    clearGenericError();
    clearCachedImprovements();
    // if (roastResponse?.id && lastCreatedDesignFormValues) {
    //   setIsUpdateMode(true);
    //   roastUpdateDesignWithValues(
    //     roastResponse?.id,
    //     lastCreatedDesignFormValues,
    //   );
    // }

    if (roastResponse?.id) {
      setIsUpdateMode(true);
      clearUpdatedRoastedDesign();
      setCurrentRoastedDesign(null);
      roastUpdateDesign(roastResponse);
    } else if (!roastResponse?.id && lastCreatedDesignFormValues) {
      clearCreatedRoastedDesign();
      roastNewDesign(lastCreatedDesignFormValues as CreateFormValues);
    }
  }, [
    roastResponse,
    roastUpdateDesign,
    clearUpdatedRoastedDesign,
    setIsUpdateMode,
    clearCachedImprovements,
    clearGenericError,
    roastUpdateDesignWithValues,
    lastCreatedDesignFormValues,
    setCurrentRoastedDesign,
  ]);

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <GoBackButton isHidden={isLoading} />
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
          initialIsShowForm={!isUpdateMode}
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

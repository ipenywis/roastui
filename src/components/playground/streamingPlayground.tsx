import {
  StreamableRoastedDesign,
  StreamableRoastedDesignsSchema,
} from '@/types/roastedDesign';
import { container, innerContainer } from './common';
import { DesignPreview } from '../designPreview';
import { useCallback, useMemo, useState } from 'react';
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

// interface StreamingPlaygroundProps {
//   streamableRoastedDesign?: DeepPartial<StreamableRoastedDesign>;
//   isLoading?: boolean;
// }

export function StreamingPlayground() {
  const [roastResponse, setRoastResponse] =
    useState<StreamableRoastedDesign | null>(null);

  // const {
  //   object: streamableRoastedDesign,
  //   isLoading,
  //   submit,
  //   error,
  // } = useObject({
  //   api: '/api/roastStreaming',
  //   schema: StreamableRoastedDesignsSchema,
  //   fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
  //     const body = init?.body as FormData;
  //     const response = await roastService.roastUIFormData(body);
  //     return response;
  //   },
  //   onFinish: ({ object }) => {
  //     if (object) {
  //       setRoastResponse(object);
  //     }
  //   },
  // });

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
  } = useRoastDesign({
    onCreationFinish: (object) => {
      setRoastResponse(object);
    },
    onUpdateFinish: (object) => {
      setRoastResponse(object);
    },
  });

  const streamableRoastedDesign = updatedRoastedDesign ?? createdRoastedDesign;

  const isLoading = isCreationLoading || isUpdateLoading;

  const handleSubmit = async (values: FormValues) => {
    await roastNewDesign(values);
  };

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

  const handleRoastAgain = useCallback(() => {
    if (lastCreatedDesignFormValues && streamableRoastedDesign?.id) {
      clearCreatedRoastedDesign();
      clearUpdatedRoastedDesign();
      roastUpdateDesign(
        streamableRoastedDesign.id,
        lastCreatedDesignFormValues,
      );
    }
  }, [
    lastCreatedDesignFormValues,
    streamableRoastedDesign?.id,
    roastUpdateDesign,
    clearCreatedRoastedDesign,
    clearUpdatedRoastedDesign,
  ]);

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <div className="flex items-center flex-col gap-5">
          <StreamingDesignTitle name={streamableRoastedDesign?.name} />
          {isLoading && <StreamingLoading />}
        </div>
        <DesignForm
          streamableRoastedDesign={streamableRoastedDesign ?? undefined}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isStreamingComplete={!!streamableRoastedDesign && !isLoading}
          onRoastAgain={handleRoastAgain}
        />
        {streamableRoastedDesign?.improvedHtml && (
          <DesignPreview
            HTML={streamableRoastedDesign.improvedHtml}
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

import {
  StreamableRoastedDesign,
  StreamableRoastedDesignsSchema,
} from '@/types/roastedDesign';
import { useObject } from './useObject';
import roastService from '@/services/roastService';
import { CreateFormValues, UpdateFormValues } from '@/components/newDesignForm';
import { DeepPartial } from 'ai';
import { useCallback, useState } from 'react';
import { RoastedDesigns } from '@prisma/client';
import { getImageFileFromUrl } from '@/lib/image-client';

type heartbeatType = {
  type: 'heartbeat';
};

interface UseRoastDesignReturn {
  roastNewDesign: (formData: CreateFormValues) => void;
  roastUpdateDesign: (
    roastedDesign: RoastedDesigns | StreamableRoastedDesign,
  ) => void;
  roastUpdateDesignWithValues: (id: string, values: UpdateFormValues) => void;
  isCreationLoading: boolean;
  isUpdateLoading: boolean;
  creationError: Error | null;
  updateError: Error | null;
  createdRoastedDesign: DeepPartial<StreamableRoastedDesign> | null;
  updatedRoastedDesign: DeepPartial<StreamableRoastedDesign> | null;
  lastCreatedDesignFormValues: CreateFormValues | UpdateFormValues | null;
  genericError: Error | null;
  clearGenericError: () => void;
  clearCreatedRoastedDesign: () => void;
  clearUpdatedRoastedDesign: () => void;
}

export function useRoastDesign({
  onCreationFinish,
  onUpdateFinish,
  initialRoastedDesign,
}: {
  onCreationFinish?: (object: StreamableRoastedDesign) => void;
  onUpdateFinish?: (object: StreamableRoastedDesign) => void;
  initialRoastedDesign?: StreamableRoastedDesign | RoastedDesigns | null;
}): UseRoastDesignReturn {
  const [lastCreatedDesignFormValues, setLastCreatedDesignFormValues] =
    useState<CreateFormValues | UpdateFormValues | null>(null);

  const [genericError, setGenericError] = useState<Error | null>(null);

  const isHeartbeat = useCallback((object: DeepPartial<heartbeatType>) => {
    if (object && typeof object === 'object') {
      return (
        Object.hasOwn(object, 'type') &&
        typeof object.type === 'string' &&
        object.type === 'heartbeat'
      );
    }

    return false;
  }, []);

  const checkForGenericError = useCallback(
    (object: StreamableRoastedDesign | RoastedDesigns) => {
      //eslint-disable-next-line no-console
      console.log('error roasting cut mid-way: ', new Date().toISOString(), {
        object,
      });
      if (
        !object.id ||
        (Object.hasOwn(object, 'chunkStatus') &&
          (object as StreamableRoastedDesign).chunkStatus !== 'COMPLETED')
      ) {
        setGenericError(
          new Error(
            'Streaming roasted design cut mid-way, please reload the page and try again!',
          ),
        );
        //TODO: Enable auto page reload
        // window.location.reload();
      }
    },
    [],
  );

  const {
    object: createdRoastedDesign,
    isLoading: isCreationLoading,
    submit: roastNewDesign,
    error: creationError,
    clear: clearCreatedRoastedDesign,
  } = useObject({
    api: '/api/roast-streaming',
    schema: StreamableRoastedDesignsSchema,
    initialValue: initialRoastedDesign,
    // debugDelay: [700, 1200], ///< only for debugging
    fetch: async (_, init?: RequestInit) => {
      const body = init?.body as FormData;
      const response = await roastService.roastUIFormData(body);
      return response;
    },
    onFinish: ({ object }) => {
      if (object) {
        checkForGenericError(object);
        onCreationFinish?.(object as StreamableRoastedDesign);
      }
    },
    isHeartbeat,
  });

  const {
    object: updatedRoastedDesign,
    isLoading: isUpdateLoading,
    submit: submitUpdate,
    error: updateError,
    clear: clearUpdatedRoastedDesign,
  } = useObject({
    api: '/api/roast-streaming',
    schema: StreamableRoastedDesignsSchema,
    initialValue: initialRoastedDesign,
    // debugDelay: [700, 1200], ///< Only for debugging
    fetch: async (_, init?: RequestInit) => {
      const body = init?.body as FormData;
      const response = await roastService.updateRoastUI(body);
      return response;
    },
    onFinish: ({ object }) => {
      if (object) {
        checkForGenericError(object);
        onUpdateFinish?.(object as StreamableRoastedDesign);
      }
    },
    isHeartbeat,
  });

  /**
   * @param reuploadImage - If true, the image will be fetched from the original image url and reuploaded
   */
  const handleRoastUpdateDesign = useCallback(
    async (
      roastedDesign: RoastedDesigns | StreamableRoastedDesign,
      reuploadImage: boolean = false,
    ) => {
      const formData = new FormData();
      if (roastedDesign.name) formData.append('name', roastedDesign.name);

      if (reuploadImage) {
        const imageFile = await getImageFileFromUrl(
          roastedDesign.originalImageUrl!,
        );
        formData.append('image', imageFile);
      }

      formData.append('id', roastedDesign.id!);
      return submitUpdate(formData);
    },
    [submitUpdate],
  );

  const handleRoastUpdateDesignWithValues = useCallback(
    async (id: string, values: UpdateFormValues) => {
      const formData = new FormData();
      formData.append('id', id);
      if (values.name) formData.append('name', values.name);
      if (values.images && values.images[0])
        formData.append('image', values.images[0]);

      setLastCreatedDesignFormValues(values);
      return submitUpdate(formData);
    },
    [submitUpdate, setLastCreatedDesignFormValues],
  );

  const handleRoastNewDesign = useCallback(
    (values: CreateFormValues) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('image', values.images[0]);

      setLastCreatedDesignFormValues(values);
      return roastNewDesign(formData);
    },
    [roastNewDesign],
  );

  const clearGenericError = useCallback(() => {
    setGenericError(null);
  }, []);

  return {
    roastNewDesign: handleRoastNewDesign,
    roastUpdateDesign: handleRoastUpdateDesign,
    roastUpdateDesignWithValues: handleRoastUpdateDesignWithValues,
    createdRoastedDesign: createdRoastedDesign ?? null,
    updatedRoastedDesign: updatedRoastedDesign ?? null,
    isCreationLoading,
    isUpdateLoading,
    creationError: creationError ?? null,
    updateError: updateError ?? null,
    lastCreatedDesignFormValues,
    clearCreatedRoastedDesign,
    clearUpdatedRoastedDesign,
    genericError,
    clearGenericError,
  };
}

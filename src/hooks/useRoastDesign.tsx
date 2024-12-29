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

  const checkForGenericError = useCallback(
    (object: StreamableRoastedDesign | RoastedDesigns) => {
      if (
        !object.id ||
        (Object.hasOwn(object, 'chunkStatus') &&
          (object as StreamableRoastedDesign).chunkStatus !== 'COMPLETED')
      ) {
        setGenericError(
          new Error(
            'Streaming roasted design cut mid-way, please check your internet connection and try again!',
          ),
        );
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
  });

  const handleRoastUpdateDesign = useCallback(
    async (roastedDesign: RoastedDesigns | StreamableRoastedDesign) => {
      const formData = new FormData();
      if (roastedDesign.name) formData.append('name', roastedDesign.name);

      const imageFile = await getImageFileFromUrl(
        roastedDesign.originalImageUrl!,
      );

      formData.append('id', roastedDesign.id!);
      formData.append('image', imageFile);
      return submitUpdate(formData);
    },
    [submitUpdate],
  );

  const handleRoastUpdateDesignWithValues = useCallback(
    async (id: string, values: UpdateFormValues) => {
      const formData = new FormData();
      formData.append('id', id);
      if (values.name) formData.append('name', values.name);
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

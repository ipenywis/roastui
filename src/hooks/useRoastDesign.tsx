import {
  StreamableRoastedDesign,
  StreamableRoastedDesignsSchema,
} from '@/types/roastedDesign';
import { useObject } from './useObject';
import roastService from '@/services/roastService';
import { CreateFormValues, UpdateFormValues } from '@/components/newDesignForm';
import { DeepPartial } from 'ai';
import { useCallback, useState } from 'react';

interface UseRoastDesignReturn {
  roastNewDesign: (formData: CreateFormValues) => void;
  roastUpdateDesign: (id: string, formData: UpdateFormValues) => void;
  isCreationLoading: boolean;
  isUpdateLoading: boolean;
  creationError: Error | null;
  updateError: Error | null;
  createdRoastedDesign: DeepPartial<StreamableRoastedDesign> | null;
  updatedRoastedDesign: DeepPartial<StreamableRoastedDesign> | null;
  lastCreatedDesignFormValues: CreateFormValues | null;
  clearCreatedRoastedDesign: () => void;
  clearUpdatedRoastedDesign: () => void;
}

export function useRoastDesign({
  onCreationFinish,
  onUpdateFinish,
}: {
  onCreationFinish?: (object: StreamableRoastedDesign) => void;
  onUpdateFinish?: (object: StreamableRoastedDesign) => void;
}): UseRoastDesignReturn {
  const [lastCreatedDesignFormValues, setLastCreatedDesignFormValues] =
    useState<CreateFormValues | null>(null);

  const {
    object: createdRoastedDesign,
    isLoading: isCreationLoading,
    submit: roastNewDesign,
    error: creationError,
    clear: clearCreatedRoastedDesign,
  } = useObject({
    api: '/api/roast-streaming',
    schema: StreamableRoastedDesignsSchema,
    fetch: async (_, init?: RequestInit) => {
      const body = init?.body as FormData;
      const response = await roastService.roastUIFormData(body);
      return response;
    },
    onFinish: ({ object }) => {
      if (object) {
        onCreationFinish?.(object);
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
    fetch: async (_, init?: RequestInit) => {
      const body = init?.body as FormData;
      const response = await roastService.updateRoastUI(body);
      return response;
    },
    onFinish: ({ object }) => {
      if (object) {
        onUpdateFinish?.(object);
      }
    },
  });

  const handleRoastUpdateDesign = useCallback(
    (id: string, values: UpdateFormValues) => {
      const formData = new FormData();
      if (values.name) formData.append('name', values.name);

      formData.append('id', id);
      formData.append('image', values.images[0]);
      return submitUpdate(formData);
    },
    [submitUpdate],
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

  return {
    roastNewDesign: handleRoastNewDesign,
    roastUpdateDesign: handleRoastUpdateDesign,
    createdRoastedDesign: createdRoastedDesign ?? null,
    updatedRoastedDesign: updatedRoastedDesign ?? null,
    isCreationLoading,
    isUpdateLoading,
    creationError: creationError ?? null,
    updateError: updateError ?? null,
    lastCreatedDesignFormValues,
    clearCreatedRoastedDesign,
    clearUpdatedRoastedDesign,
  };
}

'use client';

import { DesignImprovementsPreview } from '@/components/designImprovementsPreview';
import { DesignPreview } from '@/components/designPreview';
import { FormValues, NewDesignForm } from '@/components/newDesignForm';
import roastService from '@/services/roastService';
import { useState } from 'react';
import {
  StreamableRoastedDesign,
  StreamableRoastedDesignsSchema,
} from '@/types/roastedDesign';
import { useObject } from '@/hooks/useObject';
import { container, innerContainer, title } from './common';
import { StreamingPlayground } from './streamingPlayground';

export default function Playground() {
  const [roastResponse, setRoastResponse] =
    useState<StreamableRoastedDesign | null>(null);

  const { object, isLoading, submit, error } = useObject({
    api: '/api/roastStreaming',
    schema: StreamableRoastedDesignsSchema,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const body = init?.body as FormData;
      const response = await roastService.roastUIFormData(body);
      return response;
    },
    onFinish: ({ object }) => {
      if (object) {
        setRoastResponse(object);
      }
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('image', values.images[0]);

    await submit(formData);
  };

  if (object && isLoading) {
    return <StreamingPlayground streamableRoastedDesign={object} />;
  }

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <h1 className={title()}>Roast New Design</h1>
        <NewDesignForm onSubmit={handleSubmit} />
        {roastResponse && (
          <DesignPreview
            HTML={roastResponse.improvedHtml}
            react={roastResponse.improvedReact}
            originalImageUrl={roastResponse.originalImageUrl}
            designId={roastResponse.id}
          />
        )}
        {roastResponse &&
          roastResponse.improvements &&
          roastResponse.whatsWrong && (
            <DesignImprovementsPreview
              improvements={JSON.parse(roastResponse.improvements)}
              whatsWrong={JSON.parse(roastResponse.whatsWrong)}
            />
          )}
      </div>
    </div>
  );
}

'use client';

import { DesignImprovementsPreview } from '@/components/designImprovementsPreview';
import { DesignPreview } from '@/components/designPreview';
import { FormValues, NewDesignForm } from '@/components/newDesignForm';
import roastService from '@/services/roastService';
import { RoastedDesigns } from '@prisma/client';
import { cva } from 'class-variance-authority';
import { useState } from 'react';

const container = cva(
  'size-full flex flex-col p-8 items-center relative pb-12'
);

const innerContainer = cva(
  'size-full flex flex-col gap-4 max-w-screen-lg items-center'
);

const title = cva('text-3xl font-bold');

export default function Playground() {
  const [roastResponse, setRoastResponse] = useState<RoastedDesigns | null>(
    null
  );

  const onSubmit = async (values: FormValues) => {
    const response = await roastService.roastUI(values.name, values.images[0]);
    setRoastResponse(response);
  };

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <h1 className={title()}>Roast New Design</h1>
        <NewDesignForm onSubmit={onSubmit} />
        {roastResponse && (
          <DesignImprovementsPreview
            improvements={JSON.parse(roastResponse.improvements)}
            whatsWrong={JSON.parse(roastResponse.whatsWrong)}
          />
        )}
        {roastResponse && (
          <DesignPreview
            HTML={roastResponse.improvedHtml}
            originalImageUrl={roastResponse.originalImageUrl}
            designId={roastResponse.id}
          />
        )}
      </div>
    </div>
  );
}

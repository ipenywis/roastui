import { DesignImprovementsPreview } from '@/components/designImprovementsPreview';
import { DesignPreview } from '@/components/designPreview';
import { FormValues, NewDesignForm } from '@/components/newDesignForm';
import { prisma } from '@/lib/prisma';
import roastService from '@/services/roastService';
import { RoastResponse } from '@/types/roastResponse';
import { RoastedDesigns } from '@prisma/client';
import { cva } from 'class-variance-authority';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

const container = cva(
  'size-full flex flex-col p-8 items-center relative pb-12 max-h-full'
);

const innerContainer = cva(
  'size-full flex flex-col gap-4 max-w-screen-lg items-center'
);

const title = cva('text-3xl font-bold');

export default async function SingleDesignPlayground({
  params,
}: {
  params: { id: string };
}) {
  const roastedDesign = await prisma.roastedDesigns.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!roastedDesign) {
    return notFound();
  }

  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <h1 className={title()}>Design: {roastedDesign.name}</h1>
        {/* <NewDesignForm onSubmit={onSubmit} /> */}
        <DesignPreview
          HTML={roastedDesign?.improvedHtml}
          react={roastedDesign?.improvedReact}
          originalImageUrl={roastedDesign?.originalImageUrl}
        />
        {roastedDesign && (
          <DesignImprovementsPreview
            improvements={JSON.parse(roastedDesign.improvements)}
            whatsWrong={JSON.parse(roastedDesign.whatsWrong)}
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { cva } from 'class-variance-authority';
import { TabsContent } from '../ui/tabs';
import IFrame from '../iframe';

const iframeContainer = cva('w-full h-full');

interface ImprovedDesignTabProps {
  designId: string;
}

function LoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center w-full h-full text-lg">
      Loading Design...
    </div>
  );
}

function ErrorPlaceholder() {
  return (
    <div className="flex items-center justify-center w-full h-full text-lg">
      Error Loading Design! Please refresh the page.
    </div>
  );
}

export function ImprovedDesignTab(props: ImprovedDesignTabProps) {
  const { designId } = props;

  if (!designId) {
    return <ErrorPlaceholder />;
  }

  return (
    <TabsContent
      value="improvedDesign"
      className="w-full h-full mt-0 data-[state=inactive]:hidden"
      forceMount
    >
      <IFrame
        src={`/preview/${designId}`}
        className={iframeContainer()}
        loading="eager"
        fallback={<LoadingPlaceholder />}
      />
    </TabsContent>
  );
}

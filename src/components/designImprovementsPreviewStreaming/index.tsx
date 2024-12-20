'use client';

import { cva } from 'class-variance-authority';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { DesignImprovements } from '@/types/designImprovements';
import { useEffect, useMemo, useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { TypewriterQueue } from '../ui/typewriter-queue';

const container = cva('flex flex-col w-full gap-8 mt-20');

const trigger = cva(
  'flex items-center gap-1 text-xl font-semibold text-gray-300',
);

const content = cva('text-gray-400 font-normal pl-12');

const orderedList = cva('list-decimal');

const listItem = cva('my-3 font-normal');

const collapsibleIcon = cva('size-6 text-gray-500');

interface DesignImprovementsPreviewStreamingProps
  extends Partial<DesignImprovements> {}

export function DesignImprovementsPreviewStreaming({
  improvements,
  whatsWrong,
}: DesignImprovementsPreviewStreamingProps) {
  const [isWhatsWrongOpen, setIsWhatsWrongOpen] = useState(true);
  const [isImprovementsOpen, setIsImprovementsOpen] = useState(true);

  const improvementsToShow = useMemo(() => {
    return improvements?.map((improvement) => improvement.description) ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [improvements?.length]);

  const whatsWrongToShow = useMemo(() => {
    return whatsWrong?.map((item) => item.description) ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsWrong?.length]);

  return (
    <div className={container()}>
      <div className="flex flex-col">
        <Collapsible open={isWhatsWrongOpen} onOpenChange={setIsWhatsWrongOpen}>
          <CollapsibleTrigger className={trigger()}>
            What’s wrong with the design?{' '}
            {isWhatsWrongOpen ? (
              <LuChevronUp className={collapsibleIcon()} />
            ) : (
              <LuChevronDown className={collapsibleIcon()} />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className={content()}>
            <ol className={orderedList()}>
              <TypewriterQueue chunks={whatsWrongToShow} speed={20}>
                {(chunk) => (
                  <li key={chunk} className={listItem()}>
                    {chunk}
                  </li>
                )}
              </TypewriterQueue>
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="flex flex-col">
        <Collapsible
          open={isImprovementsOpen}
          onOpenChange={setIsImprovementsOpen}
        >
          <CollapsibleTrigger className={trigger()}>
            Recommendations for improving the design{' '}
            {isImprovementsOpen ? (
              <LuChevronUp className={collapsibleIcon()} />
            ) : (
              <LuChevronDown className={collapsibleIcon()} />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className={content()}>
            <ol className={orderedList()}>
              <TypewriterQueue chunks={improvementsToShow} speed={20}>
                {(chunk) => (
                  <li key={chunk} className={listItem()}>
                    {chunk}
                  </li>
                )}
              </TypewriterQueue>
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

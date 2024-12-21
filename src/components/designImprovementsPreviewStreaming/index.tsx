'use client';

import { cva } from 'class-variance-authority';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { DesignImprovements } from '@/types/designImprovements';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { TypewriterQueue } from '../ui/typewriter-queue';
import { Typewriter } from '../ui/typewriter';
import { TypewriterSequence } from '../ui/typewriter-sequence';

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

  // const whatsWrongToShow = whatsWrong
  //   ? whatsWrong.map((item) => `${item.category}: ${item.description}`)
  //   : [];
  // const improvementsToShow = improvements
  //   ? improvements.map((item) => `${item.category}: ${item.description}`)
  //   : [];

  return (
    <div className={container()}>
      <div className="flex flex-col">
        <Collapsible open={isWhatsWrongOpen} onOpenChange={setIsWhatsWrongOpen}>
          {whatsWrong && whatsWrong.length > 0 && (
            <CollapsibleTrigger className={trigger()}>
              What’s wrong with the design?{' '}
              {isWhatsWrongOpen ? (
                <LuChevronUp className={collapsibleIcon()} />
              ) : (
                <LuChevronDown className={collapsibleIcon()} />
              )}
            </CollapsibleTrigger>
          )}
          <CollapsibleContent className={content()}>
            <ol className={orderedList()}>
              {whatsWrong && whatsWrong.length > 0 && (
                <TypewriterSequence>
                  {whatsWrong
                    .map((item) => `${item.category}: ${item.description}`)
                    .map((item) => (
                      <Typewriter key={item} text={item} speed={20}>
                        {(chunk) => (
                          <li key={chunk} className={listItem()}>
                            {chunk}
                          </li>
                        )}
                      </Typewriter>
                    ))}
                </TypewriterSequence>
              )}
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="flex flex-col">
        <Collapsible
          open={isImprovementsOpen}
          onOpenChange={setIsImprovementsOpen}
        >
          {improvements && improvements.length > 0 && (
            <CollapsibleTrigger className={trigger()}>
              Recommendations for improving the design{' '}
              {isImprovementsOpen ? (
                <LuChevronUp className={collapsibleIcon()} />
              ) : (
                <LuChevronDown className={collapsibleIcon()} />
              )}
            </CollapsibleTrigger>
          )}
          <CollapsibleContent className={content()}>
            <ol className={orderedList()}>
              {improvements && improvements.length > 0 && (
                <TypewriterSequence>
                  {improvements
                    ?.map((item) => `${item.category}: ${item.description}`)
                    .map((item) => (
                      <Typewriter key={item} text={item} speed={20}>
                        {(chunk) => (
                          <li key={chunk} className={listItem()}>
                            {chunk}
                          </li>
                        )}
                      </Typewriter>
                    ))}
                </TypewriterSequence>
              )}
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

'use client';

import { cva } from 'class-variance-authority';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { DesignImprovements } from '@/types/designImprovements';
import { useState } from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

const container = cva('flex flex-col w-full gap-8 mt-20');

const trigger = cva(
  'flex items-center gap-1 text-xl font-semibold text-gray-300'
);

const content = cva('text-gray-400 font-normal pl-12');

const orderedList = cva('list-decimal');

const listItem = cva('my-3 font-normal');

const collapsibleIcon = cva('size-6 text-gray-500');

interface DesignImprovementsPreviewProps extends DesignImprovements {}

export function DesignImprovementsPreview({
  improvements,
  whatsWrong,
}: DesignImprovementsPreviewProps) {
  const [isWhatsWrongOpen, setIsWhatsWrongOpen] = useState(true);
  const [isImprovementsOpen, setIsImprovementsOpen] = useState(true);

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
              {whatsWrong.map((item) => (
                <li key={item.category} className={listItem()}>
                  <span className="font-medium">{item.category}:</span>{' '}
                  <span>{item.description}</span>
                </li>
              ))}
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
              {improvements.map((item) => (
                <li key={item.category} className={listItem()}>
                  <span className="font-medium">{item.category}:</span>{' '}
                  <span>{item.description}</span>
                </li>
              ))}
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

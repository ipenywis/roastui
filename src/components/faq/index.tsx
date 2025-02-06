import { cn } from '@/lib/utils';
import { ShowcaseSection } from '../showcaseSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import app from '@/config/app';
import { cva } from 'class-variance-authority';

const innerContainer = cva(
  'w-full max-w-3xl px-4 py-4 lg:px-10 lg:py-8 bg-[#0e0e0e] rounded-lg',
);

const answerContent = cva('text-gray-400 font-light text-sm lg:text-base');

export function Faq({ className }: { className?: string }) {
  return (
    <ShowcaseSection
      id="faq"
      title="Frequently Asked Questions"
      className={cn('mt-36 lg:mt-0 mb-24', className)}
      description={
        <>
          Have another question? Contact me on{' '}
          <a
            href="https://twitter.com/ipenywis"
            target="_blank"
            className="underline"
          >
            Twitter
          </a>{' '}
          or by{' '}
          <a
            href="emailto:islem.coderone@gmail.com"
            target="_blank"
            className="underline"
          >
            Email
          </a>
          .
        </>
      }
    >
      <div className={innerContainer()}>
        <Accordion type="single" collapsible className="w-full">
          {app.faq.map((question, idx) => (
            <AccordionItem
              value={String(idx + 1)}
              key={idx}
              className="w-full border-b-0"
            >
              <AccordionTrigger className="text-sm lg:text-base text-start">
                {question.question}
              </AccordionTrigger>
              <AccordionContent className={answerContent()}>
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ShowcaseSection>
  );
}

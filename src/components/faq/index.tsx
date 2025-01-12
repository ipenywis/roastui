import Link from 'next/link';
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
  'w-full max-w-3xl px-10 py-8 bg-[#0e0e0e] rounded-lg',
);

const answerContent = cva('text-gray-400 font-light text-base');

export function Faq() {
  return (
    <ShowcaseSection
      id="faq"
      title="Frequently Asked Questions"
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
              <AccordionTrigger className="text-base">
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

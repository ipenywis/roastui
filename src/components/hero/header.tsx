'use client';

import { cva } from 'class-variance-authority';
import { SquigglyLineSvg } from '../squigglyLineSvg';
import { Underline } from '../underline';
import { UnderlineSvg } from '../underlineSvg';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const h1Container = cva(
  'flex flex-col text-[46px] lg:text-[4rem] font-semibold text-center leading-[1.2] md:mt-[-7rem] -tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50',
);

export function Header() {
  const isMobile = !useBreakpoint('lg');

  return (
    <>
      {!isMobile && (
        <h1 className={h1Container()}>
          <span>Find how you can improve</span>
          <span>
            your <Underline lineNode={<SquigglyLineSvg />}>UI/UX</Underline>{' '}
            with <Underline lineNode={<UnderlineSvg />}>AI</Underline>
          </span>
        </h1>
      )}
      {isMobile && (
        <h1 className={h1Container()}>
          <span>
            Find how you can improve your{' '}
            <Underline lineNode={<SquigglyLineSvg />}>UI/UX</Underline> with{' '}
            <Underline lineNode={<UnderlineSvg />}>AI</Underline>
          </span>
        </h1>
      )}
    </>
  );
}

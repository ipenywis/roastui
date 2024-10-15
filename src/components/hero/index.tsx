import { cva } from 'class-variance-authority';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { hero } from './style.css';
import { SpotLight } from '../spotLight';
import { Navbar } from '../navbar';
import { Underline } from '../underline';
import { SquigglyLineSvg } from '../squigglyLineSvg';
import { UnderlineSvg } from '../underlineSvg';

const container = cva(
  'relative flex flex-col w-full h-[90%] justify-center items-center'
);

const innerContainer = cva('flex flex-col items-center z-40');

const h1Container = cva(
  'flex flex-col text-[4rem] font-semibold text-center leading-[1.2] md:mt-[-7rem] -tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50'
);

const description = cva(
  'text-md font-normal text-gray-400 max-w-2xl text-center mt-6'
);

const tryItNowButton = cva('mt-10');

export function Hero() {
  return (
    <div className={cn(hero, 'flex flex-col w-full h-screen')}>
      <Navbar />
      <div className={cn(container())}>
        <SpotLight />
        <div className={innerContainer()}>
          <h1 className={h1Container()}>
            <span>Find how you can improve</span>
            <span>
              your <Underline lineNode={<SquigglyLineSvg />}>UI/UX</Underline>{' '}
              with <Underline lineNode={<UnderlineSvg />}>AI</Underline>
            </span>
          </h1>
          <p className={description()}>
            Transform your UI/UX designs with our AI: detect flaws, get tailored
            improvement suggestions, and receive a newly generated, optimized
            design in seconds.
          </p>
          <Button className={tryItNowButton()}>Try it Now! ✨</Button>
        </div>
      </div>
    </div>
  );
}

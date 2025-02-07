import { cva } from 'class-variance-authority';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { hero } from './style.css';
import { SpotLight } from '../spotLight';
import { HeroShow } from '../heroShow';
import Link from 'next/link';
import { Header } from './header';
import { Navbar } from '../navbar';

const container = cva(
  'relative flex flex-col w-full min-h-screen items-center',
);

const innerContainer = cva(
  'flex flex-col h-[60vh] lg:h-[70vh] justify-center items-center z-40',
);

const description = cva(
  'text-sm lg:text-md font-normal text-gray-400 max-w-2xl text-center mt-6',
);

const tryItNowButton = cva('mt-10');

export function Hero() {
  return (
    <div
      className={cn(hero, 'flex flex-col w-full min-h-screen lg:mb-[20rem]')}
    >
      <Navbar />
      <div className={cn(container())}>
        <SpotLight />
        <div className={innerContainer()}>
          <Header />
          <p className={description()}>
            Transform your UI/UX designs with our AI: detect flaws, get tailored
            improvement suggestions, and receive a newly generated, optimized
            design in seconds.
          </p>
          <Button className={tryItNowButton()} asChild>
            <Link href="/subscribe">Try it Now! ✨</Link>
          </Button>
        </div>
        <div className="h-[20vh] lg:h-[40vh] flex justify-center items-center z-50">
          <HeroShow />
        </div>
      </div>
    </div>
  );
}

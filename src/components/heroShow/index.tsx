import NextImage from 'next/image';
import heroShowImg from '@/images/hero-show-dark.png';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const borderAnimation = cva(
  '[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.blue.500)_86%,_theme(colors.blue.300)_90%,_theme(colors.blue.500)_94%,_theme(colors.slate.600/.48))_border-box] animate-border',
);

export function HeroShow() {
  return (
    <div className="flex flex-col items-center w-full">
      <div
        className={cn(
          'flex border border-transparent rounded-lg relative w-[303px] lg:w-[800px] overflow-hidden',
          borderAnimation(),
        )}
      >
        <NextImage
          src={heroShowImg.src}
          alt="HeroShow"
          width={heroShowImg.width}
          height={heroShowImg.height}
        />
      </div>
    </div>
  );
}

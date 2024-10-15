import { cva } from 'class-variance-authority';
import { ShowcaseSection } from '../showcaseSection';
import Image from 'next/image';
import BadUiShowcaseImg from '@/images/bad-ui-showcase.png';
import GoodUiShowcaseImg from '@/images/good-ui-showcase.png';
import { DrawnArrowSvg } from '../drawnArrowSvg';

const container = cva('flex flex-wrap justify-center');

const itemContainer = cva('flex flex-col items-center');

const label = cva('text-lg font-normal text-gray-300');
const description = cva('text-sm font-normal text-gray-500');

const itemImage = cva('w-96 h-auto rounded-md mb-4');

const arrow = cva('flex w-24 mx-10 -mt-12');

export function GoodVsBadUI() {
  return (
    <ShowcaseSection
      title="Bad vs. Good UI"
      description="Good design is as little design as possible. Bad design is like a bad joke. If you have to explain it, it’s not good."
    >
      <div className={container()}>
        <div className={itemContainer()}>
          <Image
            width={BadUiShowcaseImg.width}
            height={BadUiShowcaseImg.height}
            className={itemImage()}
            src={BadUiShowcaseImg.src}
            alt="Bad UI design"
          />
          <p className={label()}>Bad ❌</p>
          <p className={description()}>(User design)</p>
        </div>
        <span className={arrow()}>
          <DrawnArrowSvg />
        </span>
        <div className={itemContainer()}>
          <Image
            width={GoodUiShowcaseImg.width}
            height={GoodUiShowcaseImg.height}
            className={itemImage()}
            src={GoodUiShowcaseImg.src}
            alt="Good UI design"
          />
          <p className={label()}>Good ✅</p>
          <p className={description()}>(Improved by AI)</p>
        </div>
      </div>
    </ShowcaseSection>
  );
}

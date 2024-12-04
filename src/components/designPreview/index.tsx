import { cva } from 'class-variance-authority';
import { Tools } from './tools';
import { Tabs } from '../ui/tabs';
import { ImprovedDesignTab } from './improvedDesignTab';
import { OriginalDesignTab } from './originalDesignTab';
import { ImprovedHtmlSandpackTab } from './improvedHtmlSandpackTab';
import { UiHighlights } from '@/types/newDesign';

const container = cva(
  'flex w-[1000px] h-[800px] flex-col justify-center items-center mt-10 relative border border-gray-600 rounded-lg overflow-hidden'
);

const innerContainer = cva(
  'flex flex-col relative size-full min-w-full min-h-full overflow-hidden border'
);

interface DesignPreviewProps {
  designId: string;
  HTML?: string;
  react?: string;
  originalImageUrl?: string;
  uiHighlights?: UiHighlights;
}

export function DesignPreview({
  HTML,
  react,
  originalImageUrl,
  designId,
}: DesignPreviewProps) {
  if (!HTML) return null;

  return (
    <Tabs defaultValue="improvedDesign">
      <div className={container()}>
        <div className={innerContainer()}>
          <Tools />
          <ImprovedDesignTab designId={designId} />
          <ImprovedHtmlSandpackTab HTML={HTML} react={react} />
          {originalImageUrl && (
            <OriginalDesignTab originalImageUrl={originalImageUrl} />
          )}
        </div>
      </div>
    </Tabs>
  );
}

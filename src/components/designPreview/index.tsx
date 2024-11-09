import { cva } from 'class-variance-authority';
import { Tools } from './tools';
import { Tabs } from '../ui/tabs';
import { ImprovedDesignTab } from './improvedDesignTab';
import { OriginalDesignTab } from './originalDesignTab';
import { ImprovedHtmlSandpackTab } from './improvedHtmlSandpackTab';

const container = cva(
  'flex flex-col justify-center items-center mt-10 relative border border-gray-600 rounded-lg overflow-hidden'
);

const innerContainer = cva(
  'flex flex-col relative w-[1000px] h-[800px] overflow-hidden border'
);

interface DesignPreviewProps {
  HTML?: string;
  react?: string;
  originalImageUrl?: string;
}

export function DesignPreview({
  HTML,
  react,
  originalImageUrl,
}: DesignPreviewProps) {
  if (!HTML) return null;

  return (
    <div className={container()}>
      <Tabs defaultValue="improvedDesign">
        <div className={innerContainer()}>
          <Tools />
          <ImprovedDesignTab HTML={HTML} />
          <ImprovedHtmlSandpackTab HTML={HTML} react={react} />
          {originalImageUrl && (
            <OriginalDesignTab originalImageUrl={originalImageUrl} />
          )}
        </div>
      </Tabs>
    </div>
  );
}

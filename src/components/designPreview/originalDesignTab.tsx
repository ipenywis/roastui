import { TabsContent } from '@/components/ui/tabs';
import Image from 'next/image';

interface OriginalDesignTabProps {
  originalImageUrl: string;
}

export function OriginalDesignTab({
  originalImageUrl,
}: OriginalDesignTabProps) {
  return (
    <TabsContent
      value="originalDesign"
      className="w-full h-full relative mt-0 data-[state=inactive]:hidden"
      forceMount
    >
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <div className="relative h-[80%] w-full">
          <Image
            src={originalImageUrl}
            alt="Original Design"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </TabsContent>
  );
}

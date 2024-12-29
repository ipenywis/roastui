'use client';

import { cva } from 'class-variance-authority';
import { Checkbox } from '../ui/checkbox';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { Separator } from '../ui/separator';
import { usePreviewFullScreenMode } from '@/hooks/usePreviewFullScreenMode';
import { Button } from '../ui/button';
import { LuImageDown } from 'react-icons/lu';
import { useCallback } from 'react';
import { useToJpeg } from '@hugocxl/react-to-image';
import { saveFileWithDialog } from '@/lib/image-client';
import { RoastedDesigns } from '@prisma/client';

const checkboxItem = cva(
  'flex items-center gap-2 cursor-pointer select-none py-3 h-full',
);

const checkboxLabel = cva('text-sm font-medium');

interface UiHighlightsControlsProps {
  roastedDesign: RoastedDesigns;
}

export function UiHighlightsControls(props: UiHighlightsControlsProps) {
  const { roastedDesign } = props;

  const isImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.isImprovementsHighlightActive,
  );
  const setIsImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.setIsImprovementsHighlightActive,
  );

  const handleImprovementsHighlightChange = (checked: boolean) => {
    setIsImprovementsHighlightActive(checked);
  };

  const { isPreviewFullScreenMode, setIsPreviewFullScreenMode } =
    usePreviewFullScreenMode();

  const handlePreviewFullScreenModeChange = (checked: boolean) => {
    setIsPreviewFullScreenMode(checked);
  };

  const handleImageConversionSuccess = useCallback(
    async (dataUrl: string) => {
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const file = new File(
        [blob],
        roastedDesign.name || 'roasted-design.png',
        {
          type: 'image/png',
        },
      );
      await saveFileWithDialog(file, dataUrl);
    },
    [roastedDesign],
  );

  const [_, convertToImage] = useToJpeg({
    selector: '#html-container',
    onSuccess: handleImageConversionSuccess,
  });

  const handleExportImage = useCallback(() => {
    convertToImage();
  }, [convertToImage]);

  return (
    <div className="absolute bottom-5 right-4 z-20 h-10">
      <div className="bg-black text-white rounded-lg px-5 shadow-md flex items-center gap-3 h-full">
        <div className={checkboxItem()}>
          <Checkbox
            id="highlight-arrow"
            checked={isImprovementsHighlightActive}
            onCheckedChange={handleImprovementsHighlightChange}
          />
          <label htmlFor="highlight-arrow" className={checkboxLabel()}>
            UI Highlights
          </label>
        </div>
        <Separator orientation="vertical" className="h-3/5 grow bg-slate-600" />
        <div className={checkboxItem()}>
          <Checkbox
            id="full-screen-mode"
            checked={isPreviewFullScreenMode}
            onCheckedChange={handlePreviewFullScreenModeChange}
          />
          <label htmlFor="full-screen-mode" className={checkboxLabel()}>
            Full Screen Mode
          </label>
        </div>
        <Separator orientation="vertical" className="h-3/5 grow bg-slate-600" />
        <div className={checkboxItem()}>
          <Button
            className="flex items-center gap-1.5 p-0"
            variant="link"
            onClick={handleExportImage}
          >
            <LuImageDown className="size-4" />
            Export image
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { cva } from 'class-variance-authority';
import { Checkbox } from '../ui/checkbox';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { Separator } from '../ui/separator';
import { usePreviewFullScreenMode } from '@/hooks/usePreviewFullScreenMode';

const checkboxItem = cva(
  'flex items-center gap-2 cursor-pointer select-none py-3 h-full',
);

const checkboxLabel = cva('text-sm font-medium');

export function UiHighlightsControls() {
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
      </div>
    </div>
  );
}

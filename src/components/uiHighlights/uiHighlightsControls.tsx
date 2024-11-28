'use client';

import { cva } from 'class-variance-authority';
import { Checkbox } from '../ui/checkbox';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';

const checkboxItem = cva('flex items-center gap-2 cursor-pointer select-none');

const checkboxLabel = cva('text-sm font-medium');

export function UiHighlightsControls() {
  const isImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.isImprovementsHighlightActive
  );
  const setIsImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.setIsImprovementsHighlightActive
  );

  const handleImprovementsHighlightChange = (checked: boolean) => {
    setIsImprovementsHighlightActive(checked);
  };

  return (
    <div className="absolute bottom-5 right-4 z-20">
      <div className="bg-black text-white rounded-lg py-3 px-5 shadow-md flex items-center gap-2">
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
      </div>
    </div>
  );
}

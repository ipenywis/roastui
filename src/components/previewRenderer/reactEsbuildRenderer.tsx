'use client';

import { usePreviewViewStore } from '@/lib/providers/previewViewStoreProvider';
import {
  compileAndInjectReactEsbuild,
  createPreviewRenderer,
  getEsbuildTargetRenderElement,
} from '@/lib/render';
import { RoastedDesigns } from '@prisma/client';
import { useCallback, useEffect, useMemo } from 'react';

import { useErrorBoundary } from 'react-error-boundary';

interface ReactEsbuildRendererProps {
  roastedDesign: RoastedDesigns;
}

export function ReactEsbuildRenderer({
  roastedDesign,
}: ReactEsbuildRendererProps) {
  const { showBoundary } = useErrorBoundary();

  const renderingStatus = usePreviewViewStore((store) => store.renderingStatus);
  const setRenderingStatus = usePreviewViewStore(
    (store) => store.setRenderingStatus,
  );

  const previewRenderer = useMemo(
    () => createPreviewRenderer(roastedDesign),
    [roastedDesign],
  );

  const handleScriptError = useCallback(() => {
    setRenderingStatus('error');
    showBoundary(new Error('Error injecting esbuild script'));
  }, [showBoundary, setRenderingStatus]);

  const prepareAndCompile = useCallback(async () => {
    if (renderingStatus === 'pending' || renderingStatus === 'success') return;

    setRenderingStatus('pending');

    try {
      await compileAndInjectReactEsbuild(
        previewRenderer,
        undefined,
        handleScriptError,
      );

      setRenderingStatus('success');
    } catch (err) {
      setRenderingStatus('error');
      showBoundary(err);
    }

    setRenderingStatus('success');
  }, [
    showBoundary,
    previewRenderer,
    setRenderingStatus,
    renderingStatus,
    handleScriptError,
  ]);

  useEffect(() => {
    prepareAndCompile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return getEsbuildTargetRenderElement(previewRenderer);
}

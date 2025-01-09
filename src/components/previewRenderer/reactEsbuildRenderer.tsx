'use client';

import {
  compileAndInjectReactEsbuild,
  createPreviewRenderer,
  getEsbuildTargetRenderElement,
} from '@/lib/render';
import { RoastedDesigns } from '@prisma/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useErrorBoundary } from 'react-error-boundary';

interface ReactEsbuildRendererProps {
  roastedDesign: RoastedDesigns;
}

export function ReactEsbuildRenderer({
  roastedDesign,
}: ReactEsbuildRendererProps) {
  const [compilationStatus, setCompilationStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const { showBoundary } = useErrorBoundary();

  const previewRenderer = useMemo(
    () => createPreviewRenderer(roastedDesign),
    [roastedDesign],
  );

  const handleScriptError = useCallback(() => {
    setCompilationStatus('error');
    showBoundary(new Error('Error injecting esbuild script'));
  }, [showBoundary, setCompilationStatus]);

  const prepareAndCompile = useCallback(async () => {
    if (compilationStatus === 'pending' || compilationStatus === 'success')
      return;

    setCompilationStatus('pending');

    try {
      await compileAndInjectReactEsbuild(
        previewRenderer,
        () => {
          setCompilationStatus('success');
        },
        handleScriptError,
      );
    } catch (err) {
      setCompilationStatus('error');
      showBoundary(err);
    }

    setCompilationStatus('success');
  }, [
    showBoundary,
    previewRenderer,
    setCompilationStatus,
    compilationStatus,
    handleScriptError,
  ]);

  useEffect(() => {
    prepareAndCompile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return getEsbuildTargetRenderElement(previewRenderer);
}

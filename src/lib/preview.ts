'use client';

import { UiHighlights } from '@/types/newDesign';

export interface PreviewHighlight {
  element: string;
  description: string;
}

export interface PreviewHighlightElement {
  element: HTMLElement;
  description: string;
}

export interface PreviewHighlightCoordinates {
  description: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export function getHighlightedPreviewElements(
  highlightElements: UiHighlights['improvements']
): PreviewHighlightElement[] {
  console.log('Window: ', window);
  if (!document) return [];

  const foundElements = highlightElements
    .map((highlightElement) => {
      const element = document.querySelector(
        `[data-element="${highlightElement.element}"]`
      ) as HTMLElement | null;
      return {
        element,
        description: highlightElement.improvement,
      };
    })
    .filter(
      (element): element is PreviewHighlightElement => element.element !== null
    );

  return foundElements;
}

export function getCoordinatesFromElements(
  elements: PreviewHighlightElement[]
): PreviewHighlightCoordinates[] {
  return elements.map(({ element, description }, index) => {
    const isLeft = index % 2 === 0;
    const elementWidth = element.offsetWidth;

    return {
      description,
      start: {
        x: isLeft
          ? element.offsetLeft - 100
          : element.offsetLeft + elementWidth + 100,
        y: element.offsetTop + element.offsetHeight / 2,
      },
      end: {
        x: isLeft
          ? element.offsetLeft - 10
          : element.offsetLeft + elementWidth + 10,
        y: element.offsetTop + element.offsetHeight / 2,
      },
    };
  });
}

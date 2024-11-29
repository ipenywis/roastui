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

    const coordinates = {
      description,
      start: {
        x: isLeft
          ? element.offsetLeft - 100
          : element.offsetLeft + elementWidth + 100,
        y: element.offsetTop + element.offsetHeight / 5,
      },
      end: {
        x: isLeft
          ? element.offsetLeft - 10
          : element.offsetLeft + elementWidth + 10,
        y: element.offsetTop + element.offsetHeight / 5,
      },
    };

    return coordinates;
  });
}

export function getCoordinatesSide(
  coordinates: PreviewHighlightCoordinates
): 'left' | 'right' {
  const startIsLeft = coordinates.start.x < 0;

  //Force left to avoid weird behaviors
  if (coordinates.start.x < coordinates.end.x) {
    return 'left';
  }

  return startIsLeft ? 'left' : 'right';
}

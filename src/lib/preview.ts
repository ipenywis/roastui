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
  highlightElements: UiHighlights['improvements'],
): PreviewHighlightElement[] {
  if (!document) return [];

  const foundElements = highlightElements
    .map((highlightElement) => {
      const element = document.querySelector(
        `[data-element="${highlightElement.element}"]`,
      ) as HTMLElement | null;
      return {
        element,
        description: highlightElement.improvement,
      };
    })
    .filter(
      (element): element is PreviewHighlightElement => element.element !== null,
    );

  return foundElements;
}

// export function getCoordinatesFromElements(
//   elements: PreviewHighlightElement[]
// ): PreviewHighlightCoordinates[] {
//   return elements.map(({ element, description }, index) => {
//     const isLeft = index % 2 === 0;
//     const elementWidth = element.offsetWidth;

//     const coordinates = {
//       description,
//       start: {
//         x: isLeft
//           ? element.offsetLeft - 100
//           : element.offsetLeft + elementWidth + 100,
//         y: element.offsetTop + element.offsetHeight / 5,
//       },
//       end: {
//         x: isLeft
//           ? element.offsetLeft - 10
//           : element.offsetLeft + elementWidth + 10,
//         y: element.offsetTop + element.offsetHeight / 5,
//       },
//     };

//     return coordinates;
//   });
// }

export function getRootHtmlElement(): HTMLDivElement {
  return document.querySelector('#html-container') as HTMLDivElement;
}

function getYOffsetRelativeToParent(element: HTMLElement, parent: HTMLElement) {
  let offsetTop = 0;
  let currentElement: HTMLElement | null = element;

  while (currentElement && currentElement !== parent) {
    offsetTop += currentElement.offsetTop;
    // const computedStyle = getComputedStyle(currentElement);
    // offsetTop += Number(computedStyle.marginTop.replace('px', '')) || 0;
    currentElement = currentElement.offsetParent as HTMLElement | null;
  }

  // If we exit the loop and the currentElement is the parent, return the offset
  if (currentElement === parent) {
    return offsetTop;
  }

  // Fallback: traverse directly up the DOM if offsetParent fails
  offsetTop = 0; // Reset
  currentElement = element;

  while (currentElement && currentElement !== document.body) {
    offsetTop += currentElement.offsetTop;

    if (currentElement === parent) {
      return offsetTop;
    }

    currentElement = currentElement.parentElement; // Fallback to parent traversal
  }

  return null;
}

function getXOffsetRelativeToParent(element: HTMLElement, parent: HTMLElement) {
  let offsetLeft = 0;
  let currentElement: HTMLElement | null = element;

  while (currentElement && currentElement !== parent) {
    offsetLeft += currentElement.offsetLeft;
    // const computedStyle = getComputedStyle(currentElement);
    // offsetLeft += Number(computedStyle.marginLeft.replace('px', '')) || 0;
    currentElement = currentElement.offsetParent as HTMLElement | null;
  }

  // If we exit the loop and the currentElement is the parent, return the offset
  if (currentElement === parent) {
    return offsetLeft;
  }

  // Fallback: traverse directly up the DOM if offsetParent fails
  offsetLeft = 0; // Reset
  currentElement = element;

  while (currentElement && currentElement !== document.body) {
    offsetLeft += currentElement.offsetLeft;

    if (currentElement === parent) {
      return offsetLeft;
    }

    currentElement = currentElement.parentElement; // Fallback to parent traversal
  }

  return null;
}

export function getElementComputedStyle(element: HTMLElement) {
  const computedStyle = getComputedStyle(element);
  return {
    height: Number(computedStyle.height.replace('px', '')) ?? 0,
    width: Number(computedStyle.width.replace('px', '')) ?? 0,
    borderTop: Number(computedStyle.borderTopWidth.replace('px', '')) ?? 0,
    borderBottom:
      Number(computedStyle.borderBottomWidth.replace('px', '')) ?? 0,
    paddingTop: Number(computedStyle.paddingTop.replace('px', '')) ?? 0,
    paddingBottom: Number(computedStyle.paddingBottom.replace('px', '')) ?? 0,
    marginTop: Number(computedStyle.marginTop.replace('px', '')) ?? 0,
    marginBottom: Number(computedStyle.marginBottom.replace('px', '')) ?? 0,
  };
}

function getElementPreferedSide(element: HTMLElement) {
  const boundingRect = element.getBoundingClientRect();
  return boundingRect.left < window.innerWidth / 2 ? 'left' : 'right';
}

export function getCoordinatesFromElements(
  elements: PreviewHighlightElement[],
): PreviewHighlightCoordinates[] {
  return elements.map(({ element, description }) => {
    //Check if the new way of determining the side is better
    // const isLeft = index % 2 === 0;
    const preferredSide = getElementPreferedSide(element);
    const isLeft = preferredSide === 'left';

    const rootHtmlElement = getRootHtmlElement();
    const boundingRect = element.getBoundingClientRect();

    const offsetRelativeToParent = getYOffsetRelativeToParent(
      element,
      rootHtmlElement,
    );
    const xOffsetRelativeToParent =
      getXOffsetRelativeToParent(element, rootHtmlElement) ??
      element.offsetLeft;

    const computedStyle = getElementComputedStyle(element);

    const elementHeight = (computedStyle.height + computedStyle.paddingTop) / 4;

    const centerY =
      (offsetRelativeToParent ?? boundingRect.top) + elementHeight;

    const startEdgeOffset = isLeft ? -100 : 100;
    const endEdgeOffset = isLeft ? -4 : 4;

    const coordinates = {
      description,
      start: {
        x: isLeft
          ? rootHtmlElement.offsetLeft + startEdgeOffset
          : rootHtmlElement.offsetLeft +
            rootHtmlElement.offsetWidth +
            startEdgeOffset,
        y: centerY,
      },
      end: {
        x: isLeft
          ? xOffsetRelativeToParent + endEdgeOffset
          : xOffsetRelativeToParent + element.offsetWidth + endEdgeOffset,
        y: centerY,
      },
    };

    return coordinates;
  });
}

export function debugDrawBoundingRect(element: HTMLElement) {
  const boundingRect = element.getBoundingClientRect();

  const rect = document.createElement('div');
  rect.style.position = 'absolute';
  rect.style.left = `${boundingRect.left}px`;
  rect.style.top = `${boundingRect.top}px`;
  rect.style.width = `${boundingRect.width}px`;
  rect.style.height = `${boundingRect.height}px`;
  rect.style.border = '1px solid red';
  document.body.appendChild(rect);
}

export function getCoordinatesSide(
  coordinates: PreviewHighlightCoordinates,
): 'left' | 'right' {
  const startIsLeft = coordinates.start.x < 0;

  //Force left to avoid weird behaviors
  if (coordinates.start.x < coordinates.end.x) {
    return 'left';
  }

  return startIsLeft ? 'left' : 'right';
}

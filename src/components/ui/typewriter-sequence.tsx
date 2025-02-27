'use client';

import { cloneElement, ReactElement, useState } from 'react';
import { TypewriterProps } from './typewriter';

interface TypewriterSequenceProps {
  children: ReactElement<TypewriterProps>[];
  disableTypewriter?: boolean;
}

export function TypewriterSequence({
  children,
  disableTypewriter,
}: TypewriterSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedElements, setCompletedElements] = useState<ReactElement[]>(
    [],
  );

  const handleComplete = () => {
    const currentElement = children[currentIndex];
    setCompletedElements((prev) => [...prev, currentElement]);
    setCurrentIndex((prev) => prev + 1);
  };

  const currentElement = children[currentIndex];
  const isLastElement = currentIndex >= children.length;

  if (disableTypewriter) {
    return <div>{children}</div>;
  }

  if (!currentElement && !isLastElement) return null;

  return (
    <div>
      {/* Render completed elements without animation */}
      {completedElements.map((element, index) => (
        <div key={index}>
          {/* Clone element but remove the animation by setting speed to 0 */}
          {cloneElement(element, { disableTypewriter: true })}
        </div>
      ))}

      {/* Render current animated element */}
      {currentElement &&
        cloneElement(currentElement, {
          onComplete: handleComplete,
        })}
    </div>
  );
}

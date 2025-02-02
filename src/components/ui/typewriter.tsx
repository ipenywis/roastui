'use client';

import { useEffect, useState } from 'react';

export interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  children?: (chunk: string) => React.ReactNode;
  disableTypewriter?: boolean;
}

export function Typewriter({
  text,
  speed = 30,
  onComplete,
  children,
  disableTypewriter = false,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text || disableTypewriter) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, disableTypewriter]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  if (disableTypewriter) {
    return children ? children(text) : <div>{text}</div>;
  }

  return children ? children(displayedText) : <div>{displayedText}</div>;
}

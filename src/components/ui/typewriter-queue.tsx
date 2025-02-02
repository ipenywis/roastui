'use client';

import { useEffect, useState } from 'react';
import { Typewriter } from './typewriter';

interface TypewriterQueueProps {
  chunks: string[];
  speed?: number;
  children?: (chunk: string) => React.ReactNode;
}

export function TypewriterQueue({
  chunks,
  speed = 30,
  children,
}: TypewriterQueueProps) {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentChunk, setCurrentChunk] = useState<string>('');
  const [completedChunks, setCompletedChunks] = useState<string[]>([]);

  useEffect(() => {
    if (currentChunk !== '') return;

    // Add new chunks to the queue
    setQueue((prev) => chunks.filter((chunk) => !prev.includes(chunk)));
  }, [chunks, currentChunk]);

  useEffect(() => {
    if (queue.length > 0 && !currentChunk) {
      setCurrentChunk(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, currentChunk]);

  const handleChunkComplete = () => {
    setCompletedChunks((prev) => [...prev, currentChunk]);
    setCurrentChunk('');
  };

  return (
    <div>
      {completedChunks.map((chunk, index) => (
        <div key={index}>{children ? children(chunk) : chunk}</div>
      ))}
      {currentChunk && (
        <Typewriter
          text={currentChunk}
          speed={speed}
          onComplete={handleChunkComplete}
        >
          {children}
        </Typewriter>
      )}
    </div>
  );
}

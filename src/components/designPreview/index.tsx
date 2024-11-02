import { getWrappedDesignCode } from '@/lib/html';
import { cva } from 'class-variance-authority';
import DOMPurify from 'isomorphic-dompurify';

const container = cva('flex justify-center items-center mt-10');

const iframeContainer = cva('w-[800px] min-h-[600px] rounded-lg');

interface DesignPreviewProps {
  HTML?: string;
}

export function DesignPreview({ HTML }: DesignPreviewProps) {
  if (!HTML) return null;

  return (
    <div className={container()}>
      <iframe
        srcDoc={getWrappedDesignCode(DOMPurify.sanitize(HTML), 'html')}
        className={iframeContainer()}
      ></iframe>
    </div>
  );
}

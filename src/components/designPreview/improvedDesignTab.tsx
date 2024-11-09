import { getWrappedDesignCode } from '@/lib/html-server';
import { cva } from 'class-variance-authority';
import DOMPurify from 'isomorphic-dompurify';
import { TabsContent } from '../ui/tabs';

const iframeContainer = cva('w-full h-full');

export function ImprovedDesignTab({ HTML }: { HTML: string }) {
  return (
    <TabsContent value="improvedDesign" className="w-full h-full mt-0">
      <iframe
        srcDoc={getWrappedDesignCode(DOMPurify.sanitize(HTML), 'html')}
        className={iframeContainer()}
      ></iframe>
    </TabsContent>
  );
}

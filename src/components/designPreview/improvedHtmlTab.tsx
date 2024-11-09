import { getWrappedDesignCode } from '@/lib/html-server';
import { cva } from 'class-variance-authority';
import DOMPurify from 'isomorphic-dompurify';
import { TabsContent } from '../ui/tabs';
import { useEffect } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function ImprovedHtmlTab({ HTML }: { HTML: string }) {
  return (
    <TabsContent
      value="improvedHtml"
      className="w-full h-full overflow-auto mt-0 relative"
    >
      <SyntaxHighlighter
        language="html"
        style={atomOneDark}
        wrapLongLines
        showLineNumbers
        wrapLines
      >
        {HTML}
      </SyntaxHighlighter>
    </TabsContent>
  );
}

import { TabsContent } from '../ui/tabs';

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

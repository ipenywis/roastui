import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { TabsContent } from '../ui/tabs';
import { cva } from 'class-variance-authority';

const provider = cva(
  'w-full h-full [&_.sp-tab-container:has(button:focus)]:outline-none'
);

export function ImprovedHtmlSandpackTab({
  HTML,
  react,
}: {
  HTML: string;
  react?: string;
}) {
  return (
    <TabsContent
      value="improvedHtml"
      className="w-full h-full overflow-auto mt-0 relative"
    >
      <SandpackProvider
        files={{
          '/HTML': HTML,
          ...(react ? { '/React': react } : {}),
        }}
        options={{
          visibleFiles: ['/HTML', react ? '/React' : undefined].filter(
            Boolean
          ) as string[],
        }}
        customSetup={{
          entry: '/HTML',
        }}
        className={provider()}
        style={{ height: '100%' }}
        theme="dark"
      >
        <SandpackLayout className="w-full h-full" style={{ height: '100%' }}>
          <SandpackCodeEditor
            className="w-full h-full"
            style={{ height: '100%', fontSize: '14px' }}
            wrapContent
            showLineNumbers
            readOnly
            showTabs
          />
        </SandpackLayout>
      </SandpackProvider>
    </TabsContent>
  );
}

import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { TabsContent } from '../ui/tabs';
import { cva } from 'class-variance-authority';

const provider = cva(
  'w-full h-full [&_.sp-tab-container:has(button:focus)]:outline-none',
);

export function ImprovedHtmlSandpackTab({
  HTML,
  react,
}: {
  HTML: string;
  react?: string;
}) {
  const isReactAvailable = react && react.length > 0;

  return (
    <TabsContent
      value="improvedHtml"
      className="w-full h-full overflow-auto mt-0 relative data-[state=inactive]:hidden"
      forceMount
    >
      <SandpackProvider
        files={{
          ...(isReactAvailable ? { '/React': react } : {}),
          '/HTML': HTML,
        }}
        options={{
          visibleFiles: [
            isReactAvailable ? '/React' : undefined,
            '/HTML',
          ].filter(Boolean) as string[],
        }}
        customSetup={{
          entry: isReactAvailable ? '/React' : '/HTML',
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

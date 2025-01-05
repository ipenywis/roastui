'use client';

import { useEffect, useRef } from 'react';

interface DynamicComponentRendererProps {
  compiledCode: string;
}

const extractMainComponent = (code: string): { name: string; code: string } => {
  // Try "export default ComponentName" syntax first
  let exportMatch = code.match(/export\s+default\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/);

  if (exportMatch) {
    const componentName = exportMatch[1];
    // Remove the export default statement
    const cleanedCode = code.replace(
      /export\s+default\s+[a-zA-Z_$][0-9a-zA-Z_$]*/,
      '',
    );
    return { name: componentName, code: cleanedCode };
  }

  // Try "export { Component as default }" syntax
  exportMatch = code.match(
    /export\s*{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s+as\s+default\s*}/,
  );

  if (exportMatch) {
    const componentName = exportMatch[1];
    // Remove the export statement
    const cleanedCode = code.replace(
      /export\s*{\s*[a-zA-Z_$][0-9a-zA-Z_$]*\s+as\s+default\s*}/,
      '',
    );
    return { name: componentName, code: cleanedCode };
  }

  // eslint-disable-next-line no-console
  console.error('No default export found');
  return { name: '', code };
};

export function DynamicComponentRenderer({
  compiledCode,
}: DynamicComponentRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const { name, code } = extractMainComponent(compiledCode);
    if (!name) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script>
            try {
              ${code}
              ReactDOM.render(
                React.createElement(${name}),
                document.getElementById('root')
              );
            } catch (error) {
              console.error('Render error:', error);
              document.getElementById('root').innerHTML = 
                '<div style="color: red;">Error: ' + error.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
    }
  }, [compiledCode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <iframe
        ref={iframeRef}
        style={{
          border: '1px solid #ccc',
          width: '100%',
          height: '100%',
        }}
        sandbox="allow-scripts allow-same-origin"
        title="Component Preview"
      />
    </div>
  );
}

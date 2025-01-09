'use client';

import { RoastedDesigns } from '@prisma/client';
import DOMPurify from 'isomorphic-dompurify';
import JsxParser from 'react-jsx-parser';
import { extractJsx } from '@/lib/render';
import esBundle from '@/lib/bundler';
import { useCallback, useEffect, useState } from 'react';
import { DynamicComponentRenderer } from '@/components/dynamicComponentRenderer';
import {
  extractMainReactComponent,
  prepareReactCode,
} from '@/lib/bundler/prepare';
import { ErrorBoundary } from 'react-error-boundary';
import { ReactEsbuildRenderer } from '@/components/previewRenderer/reactEsbuildRenderer';
import { ReactJsxParserRenderer } from '@/components/previewRenderer/reactJsxParserRenderer';
import { HtmlRawRenderer } from '@/components/previewRenderer/htmlRawRenderer';

// export function MainDesignNodeDynamic({
//   data,
// }: {
//   data: { roastedDesign: RoastedDesigns };
// }) {
//   const { roastedDesign } = data;
//   const [compiledCode, setCompiledCode] = useState<string>('');

//   const compile = useCallback(async () => {
//     const reactCode =
//       roastedDesign.internalImprovedReact !== ''
//         ? roastedDesign.internalImprovedReact
//         : roastedDesign.improvedReact;
//     const result = await esBundle(reactCode);
//     setCompiledCode(result.output);

//     const component = extractMainReactComponent(result.output);

//     const script = document.createElement('script');
//     script.setAttribute('type', 'module');
//     script.innerHTML = `
//       ${result.output}

//       ReactDOM.render(
//         React.createElement(${component.name}),
//         document.getElementById('preview-root')
//       );
//     `;
//     document.body.appendChild(script);
//   }, [roastedDesign.internalImprovedReact, roastedDesign.improvedReact]);

//   useEffect(() => {
//     compile();
//   }, [compile]);

//   // return <JsxParser jsx={compiledCode} />;

//   return <div id="preview-root"></div>;

//   return <DynamicComponentRenderer compiledCode={compiledCode} />;

//   return <div>Dynamic React compiling/rendering test</div>;
// }

export function MainDesignNodeDynamic({
  data,
}: {
  data: { roastedDesign: RoastedDesigns };
}) {
  const { roastedDesign } = data;

  return (
    <ErrorBoundary fallback={<HtmlRawRenderer roastedDesign={roastedDesign} />}>
      <ErrorBoundary
        fallback={<ReactJsxParserRenderer roastedDesign={roastedDesign} />}
      >
        <ReactEsbuildRenderer roastedDesign={roastedDesign} />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

import React, { useMemo } from 'react';
import { RoastedDesigns } from '@prisma/client';
import esBundle, { BundledResult, loadEsbuild } from './bundler';
import { extractMainReactComponent } from './bundler/prepare';
import JsxParser from 'react-jsx-parser';
import ReactDOM from 'react-dom';
import DOMPurify from 'isomorphic-dompurify';

// Supported icon libraries
const iconLibraries = {
  // TODO: Add react-icons support (currently not working)
  // reactIcons: {
  // fa: require('react-icons/fa'),
  // md: require('react-icons/md'),
  // ai: require('react-icons/ai'),
  // ci: require('react-icons/ci'),
  // Add more react-icons sub-libraries as needed
  // },
  lucide: require('lucide-react'),
};

function cleanImports(rawJsx: string) {
  // Removes `import React from 'react';` or similar variations
  return rawJsx.replace(
    /^\s*import\s+React\s+from\s+['"]react['"];?\s*$/gm,
    '',
  );
}

// Transform raw JSX into dynamically resolved imports
export function transformJsx(rawJsx: string) {
  rawJsx = cleanImports(rawJsx);

  // if (!rawJsx.includes('export default')) {
  //   rawJsx = `${rawJsx}\nexport default IconComponent;`;
  // }

  rawJsx = rawJsx.replace(
    /import\s+{([^}]+)}\s+from\s+['"](react-icons\/(\w+)|lucide-react)['"];/g,
    (_, icons, library, reactIconsSubLib) => {
      return icons
        .split(',')
        .map((icon: string) => {
          const iconName = icon.trim();
          if (library === 'lucide-react') {
            return `const ${iconName} = iconLibraries.lucide['${iconName}'];`;
          }
          return `const ${iconName} = iconLibraries.reactIcons['${reactIconsSubLib}']['${iconName}'];`;
        })
        .join('\n');
    },
  );

  return rawJsx;
}

//Create a method that takes a React code as a string and returns only the JSX part of the code
export function extractJsx(rawJsx: string) {
  // First, try to find the component's return statement
  const returnMatch = rawJsx.match(/return\s*\(([\s\S]*?)\);/);
  if (returnMatch) {
    return returnMatch[1].trim();
  }

  // If no return statement, look for JSX between arrow function or render method
  const arrowMatch = rawJsx.match(/=>\s*\(([\s\S]*?)\);/);
  if (arrowMatch) {
    return arrowMatch[1].trim();
  }

  // As a fallback, try to find any JSX-like structure
  const jsxMatch = rawJsx.match(/<[\w\s]*>[\s\S]*?<\/[\w]*>/);
  return jsxMatch ? jsxMatch[0] : null;
}

interface PreviewRendererOptions {
  reactRenderElementId?: string;
  esbuildWrapperElementId?: string;
  renderingMethod?: 'auto' | 'react-esbuild' | 'react-jsx-parser' | 'html';
}

interface PreviewRenderer {
  roastedDesign: RoastedDesigns;
  options: PreviewRendererOptions;
}

export function createPreviewRenderer(
  roastedDesign: RoastedDesigns,
  options: PreviewRendererOptions = {
    reactRenderElementId: 'html-container',
    esbuildWrapperElementId: 'esbuild-wrapper',
  },
): PreviewRenderer {
  return {
    roastedDesign,
    options,
  };
}

export function preloadPreviewRenderer(): Promise<unknown> {
  return loadEsbuild();
}

export function getReactCode(renderer: PreviewRenderer): string {
  const reactCode =
    renderer.roastedDesign.internalImprovedReact !== ''
      ? renderer.roastedDesign.internalImprovedReact
      : renderer.roastedDesign.improvedReact;

  return reactCode;
}

export function getHtmlCode(renderer: PreviewRenderer): string {
  const htmlCode =
    renderer.roastedDesign.internalImprovedHtml !== ''
      ? renderer.roastedDesign.internalImprovedHtml
      : renderer.roastedDesign.improvedHtml;

  return htmlCode;
}

//This should mainly be used for injecting globals to the iframe window global scope
export function injectGlobalsToCurrentWindow() {
  //TODO: Make sure to use React v18 for now
  //If the app has an upgraded version, install the older version of react and react-dom
  //Or switch to React v19+
  window.globalThis.React = React;
  window.globalThis.ReactDOM = ReactDOM;
}

export function injectEsbuildScript(
  renderer: PreviewRenderer,
  compiledCode: string,
  onScriptError?: () => void,
): HTMLScriptElement | null {
  try {
    if (document.getElementById('esbuild-script')) {
      return document.getElementById('esbuild-script') as HTMLScriptElement;
    }

    const script = document.createElement('script');
    const component = extractMainReactComponent(compiledCode);
    script.setAttribute('id', 'esbuild-script');
    script.setAttribute('type', 'module');

    //Pass this down to the window object so that it can be used by the esbuild script execution scope
    //window is a reference of the iframe's window object
    (window as any).showErrorBoundary = () => {
      if (onScriptError) {
        onScriptError();
      }
    };

    injectGlobalsToCurrentWindow();

    script.innerHTML = `
    // Set up global error handlers first
    window.onerror = function(message) {
      if (window && window.showErrorBoundary) {
        window.showErrorBoundary();
      }
      return false; // Let other error handlers run
    };

    window.onunhandledrejection = function() {
      if (window && window.showErrorBoundary) {
        window.showErrorBoundary();
      }
    };
    
    /*COMPILED CODE START*/
    ${compiledCode}
    /*COMPILED CODE END*/

    try {
      ReactDOM.render(
        React.createElement(${component.name}),
        document.getElementById("${renderer.options.reactRenderElementId}")
      );
    } catch (err) {
      console.log('Error injecting esbuild script!!', err);
      if (window && window.showErrorBoundary) {
        window.showErrorBoundary();
      }
    }
  `;

    const esbuildWrapperElement = document.getElementById(
      renderer.options.esbuildWrapperElementId!,
    );

    //This is a global error handler that will be used to catch errors in the iframe
    //where the esbuild script is injected and executed
    window.onerror = function () {
      onScriptError?.();
      return false; // Let other error handlers run
    };

    window.onunhandledrejection = function () {
      onScriptError?.();
    };

    if (!esbuildWrapperElement) {
      throw new Error(
        `Esbuild wrapper element with id ${renderer.options.esbuildWrapperElementId} not found`,
      );
    }

    esbuildWrapperElement.appendChild(script);

    return script;
  } catch (err) {
    throw err;
  }
}

export function getEsbuildTargetRenderElement(
  renderer: PreviewRenderer,
): JSX.Element {
  return (
    <div id={renderer.options.esbuildWrapperElementId}>
      <div id={renderer.options.reactRenderElementId}></div>
    </div>
  );
}

export async function compileAndInjectReactEsbuild(
  renderer: PreviewRenderer,
  onCompilationSuccess?: (result: BundledResult) => void,
  onScriptError?: () => void,
): Promise<string> {
  try {
    const code = getReactCode(renderer);
    const compilationResult = await esBundle(code);
    if (!compilationResult.output || compilationResult.error) {
      throw new Error('Failed to compile React code');
    }

    onCompilationSuccess?.(compilationResult);
    injectEsbuildScript(renderer, compilationResult.output, onScriptError);

    return compilationResult.output;
  } catch (err) {
    throw err;
  }
}

/**
 * This is a renderer that uses the JSXParser library to render the React code.
 * This must be called in a function react component since it uses hooks.
 */
export function RenderReactJsxParser({
  renderer,
  onError,
}: {
  renderer: PreviewRenderer;
  onError: (error: Error) => void;
}): JSX.Element {
  const code = getReactCode(renderer);
  const jsx = useMemo(() => extractJsx(code), [code]);

  if (!jsx) {
    throw new Error('Failed to extract JSX from React code for JSXParser');
  }

  return (
    <div id={renderer.options.reactRenderElementId}>
      <JsxParser
        renderInWrapper={false}
        components={iconLibraries}
        jsx={jsx}
        onError={onError}
      />
    </div>
  );
}

export function renderHtml(renderer: PreviewRenderer): JSX.Element {
  const htmlCode = getHtmlCode(renderer);
  return (
    <div
      id={renderer.options.reactRenderElementId}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlCode) }}
    ></div>
  );
}

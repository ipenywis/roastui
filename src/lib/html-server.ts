export function getWrappedDesignCode(code: string, framework: string) {
  if (framework === 'html') {
    return `<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <script src="https://unpkg.com/unlazy@0.11.3/dist/unlazy.with-hashing.iife.js" defer init></script>
  </head>
  <body class="bg-[#1E1E1E]">
    ${code}
  </body>
</html>`;
  }
  return code;
}

export async function precompileReactComponent(component: React.ReactNode) {
  const ReactDOMServer = (await import('react-dom/server')).default;
  const staticMarkup = ReactDOMServer.renderToStaticMarkup(component);
  // const staticMarkup = ReactDOMServer.renderToString(component);
  return staticMarkup;
}

export const extractMainReactComponent = (
  code: string,
): { name: string; code: string } => {
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

export function prepareReactCode(
  code: string,
  rootElementId: string = 'root',
): string {
  const mainComponent = extractMainReactComponent(code);

  const getWrappedComponent = (code: string) => {
    return `
      import { createRoot } from 'react-dom/client';

      ${code}

      createRoot(document.getElementById('${rootElementId}')).render(
        React.createElement('${mainComponent.name}'),
      );
    `;
  };

  return getWrappedComponent(code);
}

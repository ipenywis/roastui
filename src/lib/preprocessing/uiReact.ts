import { parse, ParseResult } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

function removeInternalDataElementsAttributes(ast: ParseResult<any>) {
  const attributeToRemove = 'data-element';

  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name === attributeToRemove) {
        path.remove();
      }
    },
  });
}

export function preprocessUiReact(reactCode: string) {
  // Parse the React code into an AST
  const ast = parse(reactCode, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // Traverse the AST and remove the specified attribute
  removeInternalDataElementsAttributes(ast);

  // Generate code back from the modified AST
  const output = generate(ast, {
    retainLines: true,
    compact: false,
  });

  return output.code;
}

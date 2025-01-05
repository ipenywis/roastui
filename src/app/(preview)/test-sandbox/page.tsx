import { DynamicComponentRenderer } from '@/components/dynamicComponentRenderer';
import { ReactSandbox } from '@/sandbox/reactSandbox';

const exampleCode = `
function AnotherComponent() {
  return <h2>This is a child component!</h2>
}

export default function TestSandbox() {
  return <div>TestSandbox wheeww this is working <AnotherComponent /></div>;
}
`;

const sandbox = new ReactSandbox({
  moduleCache: 'cached/node_modules',
});

export default async function TestSandbox() {
  sandbox.cleanup();
  const result = await sandbox.compile(exampleCode);

  return <DynamicComponentRenderer compiledCode={result.code} />;
}

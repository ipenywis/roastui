'use client';

import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

export function renderReactToHtml(react: string) {
  const div = document.createElement('div');
  const root = createRoot(div);
  flushSync(() => {
    root.render(react);
  });

  const html = div.innerHTML;

  console.log('Div: ', div);

  return html;
}

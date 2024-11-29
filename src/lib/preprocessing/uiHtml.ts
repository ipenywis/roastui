import { parse, HTMLElement } from 'node-html-parser';

function preprocessForms(root: HTMLElement) {
  const forms = root.querySelectorAll('form');

  forms.forEach((form) => {
    form.setAttribute('autocomplete', 'off');
  });

  return root;
}

export function preprocessUiHtml(html: string) {
  const root = parse(html);

  const processedRoot = preprocessForms(root);

  return processedRoot.toString();
}

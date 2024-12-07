import { parse, HTMLElement } from 'node-html-parser';

function preprocessForms(root: HTMLElement) {
  const forms = root.querySelectorAll('form');

  forms.forEach((form) => {
    form.setAttribute('autocomplete', 'off');
  });

  return root;
}

function preprocessInternalDataElementsAttributes(root: HTMLElement) {
  const internalDataElements = root.querySelectorAll('[data-element]');

  internalDataElements.forEach((element) => {
    element.removeAttribute('data-element');
  });
}

export function preprocessUiHtml(html: string) {
  const root = parse(html);

  preprocessForms(root);
  preprocessInternalDataElementsAttributes(root);

  return root.toString();
}

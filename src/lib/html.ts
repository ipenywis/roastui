export function getWrappedDesignCode(code: string, framework: string) {
  if (framework === 'html') {
    return `<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
		<script src="https://unpkg.com/unlazy@0.11.3/dist/unlazy.with-hashing.iife.js" defer init></script>
  </head>
  <body>
    ${code}
  </body>
</html>`;
  }
  return code;
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
        {/* <script
          src="https://unpkg.com/react@18/umd/react.production.min.js"
          async
        ></script>
        <script
          src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
          async
        ></script> */}
      </head>
      <body className="bg-white">{children}</body>
    </html>
  );
}

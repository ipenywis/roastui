export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
      </head>
      <body className="bg-white">{children}</body>
    </html>
  );
}

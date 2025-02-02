export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* Tailwind CSS is required for the design preview and this page is loaded inside an iframe */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-white">{children}</body>
    </html>
  );
}

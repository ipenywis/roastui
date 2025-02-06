import { StandardNavbar } from '@/components/standardNavbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="size-full flex flex-col">
      <StandardNavbar />
      <div className="size-full flex flex-col">{children}</div>
    </div>
  );
}

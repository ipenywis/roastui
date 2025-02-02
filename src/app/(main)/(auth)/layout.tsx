import { Navbar } from '@/components/navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="size-full flex flex-col">
      <Navbar />
      <div className="size-full flex flex-col">{children}</div>
    </div>
  );
}

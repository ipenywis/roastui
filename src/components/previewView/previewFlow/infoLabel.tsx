import { cn } from '@/lib/utils';

interface InfoLabelProps {
  children: React.ReactNode;
  elementSide: 'left' | 'right';
}

export function InfoLabel(props: InfoLabelProps) {
  const { children, elementSide } = props;

  return (
    <div
      className={cn(
        'absolute rounded-lg px-3 py-2 bg-[#e5e7eb] border border-slate-300 group cursor-text',
        elementSide === 'left' ? 'right-2' : 'left-2'
      )}
    >
      <div className="flex items-center justify-center">
        <span className="text-xs max-w-[500px] truncate group-hover:max-w-none text-slate-700">
          {children}
        </span>
      </div>
    </div>
  );
}

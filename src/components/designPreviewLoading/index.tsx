import { RiLoader3Line } from 'react-icons/ri';

interface DesignPreviewLoadingProps {
  text?: string;
}

export function DesignPreviewLoading({
  text = 'Loading Design',
}: DesignPreviewLoadingProps) {
  return (
    <div className="flex items-center justify-center w-full h-full text-lg gap-2 text-white">
      {text} <RiLoader3Line className="size-4 animate-spin" />
    </div>
  );
}

export function DesingPreviewLoadingOverlay(props: DesignPreviewLoadingProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black">
      <DesignPreviewLoading {...props} />
    </div>
  );
}

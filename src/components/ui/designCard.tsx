import Image from 'next/image';

import { cva } from 'class-variance-authority';
import Link from 'next/link';

const container = cva('flex flex-col justify-center w-[190px] gap-2');
const imageContainer = cva(
  'relative flex w-full h-[130px] rounded-lg overflow-hidden transition-all duration-200 hover:brightness-90'
);
const nameContainer = cva('text-base font-medium');

interface DesignCardProps {
  id: string;
  thumbnailUrl: string;
  name: string;
}

export function DesignCard(props: DesignCardProps) {
  const { name, thumbnailUrl, id } = props;

  return (
    <Link href={`/playground/${id}`}>
      <div className={container()}>
        <div className={imageContainer()}>
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        </div>
        <span className={nameContainer()}>{name}</span>
      </div>
    </Link>
  );
}

import Image from 'next/image';

import { cva } from 'class-variance-authority';
import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';

const container = cva('flex flex-col justify-center w-[190px] gap-2');
const imageContainer = cva(
  'relative flex w-full h-[130px] rounded-lg overflow-hidden transition-all duration-200 hover:brightness-90 border border-gray-700',
);
const nameContainer = cva('text-base font-medium');
const updatedAtContainer = cva('text-xs text-gray-400');
interface DesignCardProps {
  id: string;
  thumbnailUrl: string;
  name: string;
  updatedAt: Date;
}

export function DesignCard(props: DesignCardProps) {
  const { name, thumbnailUrl, id, updatedAt } = props;

  //Formate update at like: edited 10 minutes ago or 2 days ago
  const formattedUpdatedAt = formatDistanceToNow(updatedAt, {
    addSuffix: true,
  }).replace('about ', '');

  return (
    <Link href={`/playground/${id}`}>
      <div className={container()}>
        <div className={imageContainer()}>
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        </div>
        <span className={nameContainer()}>{name}</span>
        <span className={updatedAtContainer()}>
          Edited {formattedUpdatedAt}
        </span>
      </div>
    </Link>
  );
}

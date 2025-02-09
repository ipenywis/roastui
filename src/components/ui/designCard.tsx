'use client';

import Image from 'next/image';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const container = cva('flex flex-col justify-center w-[190px] gap-2');
const imageContainer = cva(
  'relative flex w-full h-[130px] rounded-lg overflow-hidden transition-all duration-200 hover:brightness-90 border border-gray-700',
);
const nameContainer = cva('text-base font-medium');
const updatedAtContainer = cva('text-xs text-gray-500');
const headerContainer = cva('flex justify-between items-start');
const menuTrigger = cva('text-gray-400 hover:text-gray-200 transition-colors');

interface DesignCardProps {
  id: string;
  thumbnailUrl: string;
  name: string;
  updatedAt: Date;
}

export function DesignCard(props: DesignCardProps) {
  const { name, thumbnailUrl, id, updatedAt } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  //Format update at like: edited 10 minutes ago or 2 days ago
  const formattedUpdatedAt = formatDistanceToNow(updatedAt, {
    addSuffix: true,
  }).replace('about ', '');

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/roast/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete design');
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link href={`/playground/${id}`}>
      <div className={container()}>
        <div className={imageContainer()}>
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        </div>
        <div className={headerContainer()}>
          <div className="flex flex-col gap-0">
            <span className={nameContainer()}>{name}</span>
            <span className={updatedAtContainer()}>
              Edited {formattedUpdatedAt}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className={menuTrigger()}>
              <BsThreeDots />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Link>
  );
}

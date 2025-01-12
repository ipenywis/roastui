import { cva } from 'class-variance-authority';
import { YoutubeIcon } from '../icons/youtubeIcon';
import { GithubIcon } from '../icons/githubIcon';
import { XIcon } from '../icons/xIcon';
import Link from 'next/link';
import app from '@/config/app';

const container = cva('flex px-10 py-2 w-full border-t border-t-gray-800 h-16');

const innerContainer = cva('flex items-center w-full justify-between');

const copyrightText = cva('text-sm text-slate-400 font-normal');

const iconsContainer = cva('flex gap-x-4');
const icon = cva('flex w-5 h-5 fill-white');

export function Footer() {
  return (
    <div className={container()}>
      <div className={innerContainer()}>
        <span className={copyrightText()}>
          &copy; 2024 CoderOne LLC. All right reserved.
        </span>
        <div className={iconsContainer()}>
          <Link href={app.socialLinks.coderOneYoutube} className={icon()}>
            <YoutubeIcon />
          </Link>
          <Link href={app.socialLinks.githubProject} className={icon()}>
            <GithubIcon />
          </Link>
          <Link href={app.socialLinks.x} className={icon()}>
            <XIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}

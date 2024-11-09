import { RiCodeSSlashLine } from 'react-icons/ri';
import { MdImage } from 'react-icons/md';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { cva } from 'class-variance-authority';

const tabItem = cva(
  'flex items-center justify-center data-[state=active]:bg-black'
);

export function Tools() {
  return (
    <div className="w-full flex justify-end gap-1 p-2 border-b">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="improvedDesign" className={tabItem()}>
          Improved ⚡️
        </TabsTrigger>
        <TabsTrigger value="originalDesign" className={tabItem()}>
          {/* <MdImage className="size-5 cursor-pointer" /> */}
          Original 📸
        </TabsTrigger>
        <TabsTrigger value="improvedHtml" className={tabItem()}>
          Code 💻
        </TabsTrigger>
      </TabsList>
    </div>
  );
}

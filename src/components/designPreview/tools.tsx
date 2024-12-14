import { RiCodeSSlashLine } from 'react-icons/ri';
import { MdImage } from 'react-icons/md';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { cva } from 'class-variance-authority';

const tabItem = cva(
  'flex items-center justify-center data-[state=active]:bg-black',
);

interface ToolsProps {
  isImprovedDesignDisabled?: boolean;
  isOriginalDesignDisabled?: boolean;
}

export function Tools({
  isImprovedDesignDisabled,
  isOriginalDesignDisabled,
}: ToolsProps) {
  return (
    <div className="w-full flex justify-start gap-1 p-2 border-b">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger
          value="improvedDesign"
          className={tabItem()}
          disabled={isImprovedDesignDisabled}
        >
          Improved ⚡️
        </TabsTrigger>
        <TabsTrigger
          value="originalDesign"
          className={tabItem()}
          disabled={isOriginalDesignDisabled}
        >
          Original 📸
        </TabsTrigger>
        <TabsTrigger value="improvedHtml" className={tabItem()}>
          Code 💻
        </TabsTrigger>
      </TabsList>
    </div>
  );
}

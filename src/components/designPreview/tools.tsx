import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cva } from 'class-variance-authority';
import { BiSolidZap } from 'react-icons/bi';
import { BsImageFill } from 'react-icons/bs';
import { MdOutlineCode } from 'react-icons/md';

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
      <div className="flex w-full justify-between items-center gap-2">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger
            value="improvedDesign"
            className={tabItem()}
            disabled={isImprovedDesignDisabled}
          >
            <BiSolidZap className="mr-1 size-4" /> Improved
          </TabsTrigger>
          <TabsTrigger
            value="originalDesign"
            className={tabItem()}
            disabled={isOriginalDesignDisabled}
          >
            <BsImageFill className="mr-1 size-4" /> Original
          </TabsTrigger>
          <TabsTrigger value="improvedHtml" className={tabItem()}>
            <MdOutlineCode className="mr-1 size-5" /> Code
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
}

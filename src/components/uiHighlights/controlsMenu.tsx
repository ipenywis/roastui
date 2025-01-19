import { RiToolsFill } from 'react-icons/ri';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cva } from 'class-variance-authority';
import { RoastedDesigns } from '@prisma/client';
import { useDesignPreviewStore } from '@/lib/providers/designPreviewStoreProvider';
import { usePreviewFullScreenMode } from '@/hooks/usePreviewFullScreenMode';
import { useCallback } from 'react';
import { saveFileWithDialog } from '@/lib/image-client';
import { useToJpeg } from '@hugocxl/react-to-image';
import { LuImageDown } from 'react-icons/lu';
import { Checkbox } from '../ui/checkbox';

const menuItem = cva('hover:bg-slate-800');

interface ControlsMenuProps {
  roastedDesign: RoastedDesigns;
}

export function ControlsMenu(props: ControlsMenuProps) {
  const { roastedDesign } = props;

  const isImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.isImprovementsHighlightActive,
  );
  const setIsImprovementsHighlightActive = useDesignPreviewStore(
    (state) => state.setIsImprovementsHighlightActive,
  );

  const handleImprovementsHighlightChange = (checked: boolean) => {
    setIsImprovementsHighlightActive(checked);
  };

  const { isPreviewFullScreenMode, setIsPreviewFullScreenMode } =
    usePreviewFullScreenMode();

  const handlePreviewFullScreenModeChange = (checked: boolean) => {
    setIsPreviewFullScreenMode(checked);
  };

  const handleImageConversionSuccess = useCallback(
    async (dataUrl: string) => {
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const file = new File(
        [blob],
        roastedDesign.name || 'roasted-design.png',
        {
          type: 'image/png',
        },
      );
      await saveFileWithDialog(file, dataUrl);
    },
    [roastedDesign],
  );

  const [_, convertToImage] = useToJpeg({
    selector: '#html-container',
    onSuccess: handleImageConversionSuccess,
  });

  const handleExportImage = useCallback(() => {
    convertToImage();
  }, [convertToImage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-black rounded-lg text-white p-2 outline-none focus-within:outline-none hover:bg-gray-800 transition-all duration-150">
        <RiToolsFill className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white border-none">
        <DropdownMenuItem
          className={menuItem()}
          onClick={() =>
            handleImprovementsHighlightChange(!isImprovementsHighlightActive)
          }
        >
          <Checkbox
            id="highlight-arrow"
            checked={isImprovementsHighlightActive}
            onCheckedChange={handleImprovementsHighlightChange}
          />
          <label htmlFor="highlight-arrow">UI Highlights</label>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={menuItem()}
          onClick={() =>
            handlePreviewFullScreenModeChange(!isPreviewFullScreenMode)
          }
        >
          <Checkbox
            id="full-screen-mode"
            checked={isPreviewFullScreenMode}
            onCheckedChange={handlePreviewFullScreenModeChange}
          />
          <label htmlFor="full-screen-mode">Full Screen</label>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuItem()} onClick={handleExportImage}>
          <LuImageDown className="size-4" />
          Export image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:bg-red-500">
            <User />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

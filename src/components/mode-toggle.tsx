import { MoonIcon, RepeatIcon, SunIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        {theme === 'light' && <HugeiconsIcon icon={SunIcon} strokeWidth={2} className="size-6" />}
        {theme === 'dark' && <HugeiconsIcon icon={MoonIcon} strokeWidth={2} className="size-6" />}
        {theme === 'system' && (
          <HugeiconsIcon icon={RepeatIcon} strokeWidth={2} className="size-6" />
        )}
        <span className="sr-only">切换主题</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <HugeiconsIcon icon={SunIcon} className="mr-2 size-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <HugeiconsIcon icon={MoonIcon} className="mr-2 size-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <HugeiconsIcon icon={RepeatIcon} className="mr-2 size-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

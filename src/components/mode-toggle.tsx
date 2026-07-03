import { Moon, Repeat2, Sun } from 'lucide-react';

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
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === 'light' && <Sun className="size-[1.2rem] transition-all" />}
          {theme === 'dark' && <Moon className="size-[1.2rem] transition-all" />}
          {theme === 'system' && <Repeat2 className="size-[1.2rem] transition-all" />}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 size-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 size-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Repeat2 className="mr-2 size-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

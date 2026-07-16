import { GithubIcon, HomeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate } from 'react-router';
import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className="flex h-full items-center gap-2">
              <SidebarTrigger />
              <Button size="icon-sm" variant="ghost" onClick={() => void navigate('/home')}>
                <HugeiconsIcon icon={HomeIcon} strokeWidth={2} className="size-6" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/hanekawa-shiki/hanekawa-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-colors hover:text-gray-500"
              >
                <HugeiconsIcon icon={GithubIcon} strokeWidth={2} className="size-6" />
              </a>
              <ModeToggle />
            </div>
          </div>
        </header>
        <Separator />
        <div className="scroll-safari-style flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

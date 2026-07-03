import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
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

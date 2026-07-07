import { useRoutes } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { routes } from '@/router';

export function App() {
  const element = useRoutes(routes);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>{element}</TooltipProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;

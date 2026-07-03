import { useRoutes } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { routes } from '@/router';

export function App() {
  const element = useRoutes(routes);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>{element}</TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

/**
 * 主题类型
 */
type Theme = 'dark' | 'light' | 'system';

/**
 * 主题提供者属性
 */
interface ThemeProviderProps {
  children: import('react').ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * 主题提供者上下文状态
 */
interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

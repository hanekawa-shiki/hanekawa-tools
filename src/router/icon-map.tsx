import { Calendar, Home, Magnet, Wrench } from 'lucide-react';

// 图标映射表：字符串名 → React 节点
const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar />,
  Home: <Home />,
  Magnet: <Magnet />,
  Wrench: <Wrench />,
};

export function resolveIcon(iconRef: string | undefined): React.ReactNode | undefined {
  if (iconRef === undefined || iconRef === '') {
    return undefined;
  }
  return iconMap[iconRef];
}

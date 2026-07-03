import type { LucideIcon } from 'lucide-react';
import { ArrowLeftRight, Binoculars, Calendar, Home, Magnet } from 'lucide-react';

// 图标映射表：字符串名 → Lucide 组件类
const iconMap: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Binoculars,
  Calendar,
  Home,
  Magnet,
};

/**
 * 解析图标字符串为 React 节点
 * @param iconRef 图标名字符串
 * @param className 可选的 className（用于控制大小等）
 */
export function resolveIcon(
  iconRef: string | undefined,
  className?: string
): React.ReactNode | undefined {
  if (iconRef === undefined || iconRef === '') {
    return undefined;
  }
  const Icon = iconMap[iconRef];
  if (Icon === undefined) {
    return undefined;
  }
  return <Icon className={className} />;
}

import {
  ArrowLeftRightIcon,
  BinocularsIcon,
  CalendarIcon,
  HomeIcon,
  MagnetIcon,
  WrenchIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// 图标映射表：字符串名 → 图标对象
// hugeicons 的图标类型无法直接用 TypeScript 类型表达，使用 unknown 存储
const iconMap: Record<string, unknown> = {
  ArrowLeftRightIcon,
  BinocularsIcon,
  CalendarIcon,
  HomeIcon,
  MagnetIcon,
  WrenchIcon,
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
  const iconObj = iconMap[iconRef];
  if (iconObj === undefined) {
    return undefined;
  }
  return <HugeiconsIcon icon={iconObj as typeof CalendarIcon} className={className} />;
}

import {
  ArrowLeftRightIcon,
  BinocularsIcon,
  CalendarIcon,
  ColorPickerIcon,
  FileTypeIcon,
  FuelStationIcon,
  HomeIcon,
  Layers01Icon,
  MagnetIcon,
  WrenchIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// hugeicons 的图标类型无法直接用 TypeScript 类型表达，使用 unknown 存储
const iconMap: Record<string, unknown> = {
  ArrowLeftRightIcon,
  BinocularsIcon,
  CalendarIcon,
  ColorPickerIcon,
  FileTypeIcon,
  FuelStationIcon,
  HomeIcon,
  Layers01Icon,
  MagnetIcon,
  WrenchIcon,
};

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

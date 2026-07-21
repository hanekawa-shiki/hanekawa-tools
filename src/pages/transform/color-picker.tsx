import { CheckIcon, ColorPickerIcon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ---- 颜色转换工具函数 ----

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const r = Number.parseInt(h.substring(0, 2), 16);
  const g = Number.parseInt(h.substring(2, 4), 16);
  const b = Number.parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;

  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(max === 0 ? 0 : (d / max) * 100),
    v: Math.round(max * 100),
  };
}

function rgbToCmyk(
  r: number,
  g: number,
  b: number
): { c: number; m: number; y: number; k: number } {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function isValidHex(hex: string): boolean {
  return /^#?[0-9a-f]{6}$/i.test(hex);
}

function alphaToHex(alpha: number): string {
  return Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
}

// ---- 组件 ----

function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success(`${label} 已复制`);
      setTimeout(setCopied, 1500, false);
    });
  }, [value, label]);

  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-sm">{value}</code>
        <button
          type="button"
          onClick={handleCopy}
          title="复制"
          className="inline-flex shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <HugeiconsIcon icon={CheckIcon} className="size-4 text-green-600" />
          ) : (
            <HugeiconsIcon icon={Copy01Icon} className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

// 预设常用颜色
const PRESET_COLORS = [
  '#FF0000',
  '#FF5722',
  '#FF9800',
  '#FFC107',
  '#FFEB3B',
  '#8BC34A',
  '#4CAF50',
  '#009688',
  '#00BCD4',
  '#03A9F4',
  '#2196F3',
  '#3F51B5',
  '#673AB7',
  '#9C27B0',
  '#E91E63',
  '#F44336',
  '#795548',
  '#607D8B',
  '#9E9E9E',
  '#000000',
  '#FFFFFF',
];

const THEME_PRIMARY = '#008236';

export default function ColorPickerPage() {
  const [hexInput, setHexInput] = useState(THEME_PRIMARY);
  const [alpha, setAlpha] = useState(100);

  const isValid = isValidHex(hexInput);
  const normalizedHex = isValid
    ? hexInput.startsWith('#')
      ? hexInput
      : `#${hexInput}`
    : THEME_PRIMARY;

  const rgb = useMemo(() => hexToRgb(normalizedHex), [normalizedHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb.r, rgb.g, rgb.b]);
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb.r, rgb.g, rgb.b]);
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb.r, rgb.g, rgb.b]);

  const alphaDecimal = useMemo(() => Math.round(alpha) / 100, [alpha]);

  const handleNativeColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInput(e.target.value.toUpperCase());
  }, []);

  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInput(e.target.value);
  }, []);

  const handlePresetClick = useCallback((color: string) => {
    setHexInput(color.toUpperCase());
  }, []);

  const handleAlphaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAlpha(Number(e.target.value));
  }, []);

  return (
    <div className="size-full">
      <PageHeader />

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 左侧：取色器和预览 */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <HugeiconsIcon icon={ColorPickerIcon} className="size-4" />
              取色器
            </div>

            <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {/* 原生取色器 */}
              <div className="relative">
                <input
                  type="color"
                  value={normalizedHex}
                  onChange={handleNativeColorChange}
                  className="size-40 cursor-pointer rounded-lg border-0 p-0"
                  style={{ appearance: 'none' }}
                />
              </div>

              {/* 颜色信息 */}
              <div className="flex flex-1 flex-col gap-3">
                {/* 预览色块（棋盘格背景 + 透明度） */}
                <div className="relative h-20 w-full overflow-hidden rounded-lg border shadow-sm">
                  {/* 棋盘格背景 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
                    }}
                  />
                  {/* 颜色层 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alphaDecimal})`,
                    }}
                  />
                </div>

                {/* HEX 输入 */}
                <div className="flex items-center gap-2">
                  <span className="w-10 text-sm font-medium text-muted-foreground">HEX</span>
                  <Input
                    value={hexInput}
                    onChange={handleHexInputChange}
                    className={`flex-1 font-mono uppercase ${!isValid ? 'border-destructive' : ''}`}
                    maxLength={7}
                    placeholder="#000000"
                  />
                </div>
                {!isValid && (
                  <p className="text-xs text-destructive">请输入有效的 HEX 颜色值，例如 #FF5722</p>
                )}

                {/* 透明度滑块 */}
                <div className="flex items-center gap-2">
                  <span className="w-10 text-sm font-medium text-muted-foreground">透明</span>
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={alpha}
                      onChange={handleAlphaChange}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
                    />
                    <span className="w-10 text-right text-sm text-muted-foreground tabular-nums">
                      {alpha}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 预设颜色 */}
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">常用颜色</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  className={`size-8 cursor-pointer rounded-md border-2 transition-transform hover:scale-110 ${
                    normalizedHex.toUpperCase() === color.toUpperCase()
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧：颜色格式代码 */}
        <div>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <HugeiconsIcon icon={Copy01Icon} className="size-4" />
              颜色代码
            </div>

            <div className="mt-3 space-y-3">
              <CopyableField label="HEX" value={normalizedHex.toUpperCase()} />

              <CopyableField
                label="HEXA"
                value={`${normalizedHex.toUpperCase()}${alphaToHex(alphaDecimal)}`}
              />

              <CopyableField label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />

              <CopyableField
                label="RGBA"
                value={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alphaDecimal})`}
              />

              <CopyableField label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />

              <CopyableField
                label="HSLA"
                value={`hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alphaDecimal})`}
              />

              <CopyableField label="HSV" value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`} />

              <CopyableField
                label="CMYK"
                value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

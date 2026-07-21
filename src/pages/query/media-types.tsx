import { FileTypeIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Fuse from 'fuse.js';
import mimeDb from 'mime-db';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ---- 数据准备 ----

interface MediaTypeEntry {
  type: string;
  source?: string;
  charset?: string;
  compressible?: boolean;
  extensions?: string[];
}

interface MediaTypeItem {
  mime: string;
  source: string;
  charset: string;
  compressible: string;
  extensions: string[];
  extensionDisplay: string;
}

const sourceLabels: Record<string, string> = {
  iana: 'IANA',
  apache: 'Apache',
  nginx: 'Nginx',
};

function buildMediaTypeList(): MediaTypeItem[] {
  const db = mimeDb as Record<string, MediaTypeEntry>;
  return Object.entries(db)
    .map(([mime, entry]) => ({
      mime,
      source: sourceLabels[entry.source ?? ''] ?? entry.source ?? '-',
      charset: entry.charset ?? '-',
      compressible: entry.compressible === true ? '是' : entry.compressible === false ? '否' : '-',
      extensions: entry.extensions ?? [],
      extensionDisplay: (entry.extensions ?? []).map((ext) => `.${ext}`).join(', ') || '-',
    }))
    .sort((a, b) => a.mime.localeCompare(b.mime));
}

const ALL_ITEMS = buildMediaTypeList();

const fuse = new Fuse(ALL_ITEMS, {
  keys: [
    { name: 'mime', weight: 0.5 },
    { name: 'extensions', weight: 0.3 },
    { name: 'extensionDisplay', weight: 0.2 },
  ],
  threshold: 0.35,
  includeScore: true,
});

// ---- 组件 ----

function useMediaTypes() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed === '') {
      return ALL_ITEMS;
    }
    return fuse.search(trimmed).map((r) => r.item);
  }, [query]);

  return { query, setQuery, results };
}

export default function MediaTypesPage() {
  const { query, setQuery, results } = useMediaTypes();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [setQuery]
  );

  return (
    <TooltipProvider>
      <div className="flex size-full flex-col">
        <PageHeader />

        {/* 搜索框 */}
        <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pt-2 pb-3 lg:mx-0 lg:px-0">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="搜索 MIME 类型或文件后缀，如 application/pdf、.mp4、json..."
              className="pl-9"
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            共 {ALL_ITEMS.length} 种媒体类型
            {query.trim() !== '' && `，匹配 ${results.length} 条`}
          </div>
        </div>

        {/* 虚拟列表 */}
        {results.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-20 text-sm text-muted-foreground">
            未找到匹配的媒体类型
          </div>
        ) : (
          <div ref={parentRef} className="min-h-0 flex-1 overflow-auto rounded-lg border">
            {/* 表头 */}
            <div className="sticky top-0 z-10 flex items-center border-b bg-muted/80 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <div className="w-100 shrink-0 px-4 py-2">MIME 类型</div>
              <div className="hidden w-35 shrink-0 px-4 py-2 sm:block">文件后缀</div>
              <div className="hidden w-20 shrink-0 px-4 py-2 md:block">来源</div>
              <div className="hidden w-20 shrink-0 px-4 py-2 lg:block">字符集</div>
              <div className="hidden w-20 shrink-0 px-4 py-2 lg:block">可压缩</div>
            </div>

            {/* 虚拟化行 */}
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const item = results[virtualRow.index];
                return (
                  <div
                    key={item.mime}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex items-center border-b text-sm transition-colors hover:bg-muted/50"
                  >
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <div className="flex w-100 shrink-0 items-center gap-2 overflow-hidden px-4 py-3" />
                        }
                      >
                        <HugeiconsIcon
                          icon={FileTypeIcon}
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                        <span className="truncate font-mono text-xs">{item.mime}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{item.mime}</TooltipContent>
                    </Tooltip>
                    {item.extensions.length > 0 ? (
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <div className="hidden w-35 shrink-0 truncate px-4 py-3 text-xs text-muted-foreground sm:block" />
                          }
                        >
                          {item.extensionDisplay}
                        </TooltipTrigger>
                        <TooltipContent side="top">{item.extensionDisplay}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="hidden w-35 shrink-0 truncate px-4 py-3 text-xs text-muted-foreground sm:block">
                        {item.extensionDisplay}
                      </div>
                    )}
                    <div className="hidden w-20 shrink-0 px-4 py-3 text-xs text-muted-foreground md:block">
                      {item.source}
                    </div>
                    <div className="hidden w-20 shrink-0 px-4 py-3 text-xs text-muted-foreground lg:block">
                      {item.charset}
                    </div>
                    <div className="hidden w-20 shrink-0 px-4 py-3 text-xs text-muted-foreground lg:block">
                      {item.compressible}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

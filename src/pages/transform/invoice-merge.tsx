import { DragDropProvider, useDragDropMonitor } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import {
  Delete01Icon,
  Download01Icon,
  FileInputIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { PDFDocument } from 'pdf-lib';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/** A4 尺寸（单位：pt） */
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
/** A4 横向尺寸（单位：pt） */
const A4_LANDSCAPE_WIDTH = 841.89;
const A4_LANDSCAPE_HEIGHT = 595.28;

const MARGIN = 12;

const PER_PAGE_CONFIG = [
  { label: '每页 4 张（2×2）', value: '4' },
  { label: '每页 2 张（上下）', value: '2' },
];

/** 建议单次最多选择的文件数量，超过时给出警告 */
const MAX_FILES = 50;

interface InvoicePage {
  id: string;
  fileName: string;
  file: File;
  previewDataUrl?: string;
}

/**
 * 提取 PDF 第一页并生成预览用的 Blob URL
 */
async function renderPreview(pdfBytes: Uint8Array): Promise<string> {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const newDoc = await PDFDocument.create();
  const [copied] = await newDoc.copyPages(srcDoc, [0]);
  newDoc.addPage(copied);
  const savedBytes = await newDoc.save();
  const blob = new Blob([new Uint8Array(savedBytes)], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

/**
 * 将 File 读取为 Uint8Array
 */
async function readFileAsArrayBuffer(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

function getLayoutSlots(perPage: 2 | 4) {
  if (perPage === 4) {
    // 4 张时使用横向 A4 纸张（2×2 四宫格）
    const slotW = (A4_LANDSCAPE_WIDTH - MARGIN * 3) / 2;
    const slotH = (A4_LANDSCAPE_HEIGHT - MARGIN * 3) / 2;
    return [
      { x: MARGIN, y: slotH + MARGIN * 2, maxW: slotW, maxH: slotH },
      { x: slotW + MARGIN * 2, y: slotH + MARGIN * 2, maxW: slotW, maxH: slotH },
      { x: MARGIN, y: MARGIN, maxW: slotW, maxH: slotH },
      { x: slotW + MARGIN * 2, y: MARGIN, maxW: slotW, maxH: slotH },
    ];
  }

  // 每页 2 张：上下两行，全宽
  const slotH = (A4_HEIGHT - MARGIN * 3) / 2;
  return [
    { x: MARGIN, y: slotH + MARGIN * 2, maxW: A4_WIDTH - MARGIN * 2, maxH: slotH },
    { x: MARGIN, y: MARGIN, maxW: A4_WIDTH - MARGIN * 2, maxH: slotH },
  ];
}

/**
 * 单个发票卡片组件（可排序拖拽）
 */
function SortableInvoiceCard({
  inv,
  globalIdx,
  onRemove,
}: {
  inv: InvoicePage;
  globalIdx: number;
  onRemove: (idx: number) => void;
}) {
  const { ref: sortableRef, isDragging } = useSortable({
    id: inv.id,
    index: globalIdx,
  });

  return (
    <div
      ref={sortableRef}
      className={`group relative flex cursor-grab flex-col items-center overflow-hidden rounded-lg border bg-muted/30 p-2 transition-all ${
        isDragging ? 'scale-95 opacity-40' : ''
      }`}
    >
      {/* 位置编号 */}
      <div className="absolute top-1 left-1 z-10 rounded bg-primary/80 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
        #{globalIdx + 1}
      </div>
      {/* 删除按钮 */}
      <div
        onClick={() => onRemove(globalIdx)}
        title="删除"
        className="absolute top-1 right-1 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-sm bg-background/80 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
      >
        <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
      </div>
      {/* 预览 */}
      {inv.previewDataUrl != null && inv.previewDataUrl !== '' && (
        <iframe
          src={inv.previewDataUrl}
          className="pointer-events-none h-48 w-full flex-1 border-0"
          title={inv.fileName}
        />
      )}
      <span className="mt-1 w-full truncate text-center text-xs text-muted-foreground">
        {inv.fileName}
      </span>
    </div>
  );
}

/** 排序上下文：存储拖拽起始索引 */
interface SortContext {
  sourceIndex: number;
}

/**
 * 监听拖拽事件，记录 sourceIndex 和执行排序
 */
function SortMonitor({
  context,
  setInvoices,
}: {
  context: React.MutableRefObject<SortContext>;
  setInvoices: React.Dispatch<React.SetStateAction<InvoicePage[]>>;
}) {
  // 拖拽开始时记录 source 索引
  const onDragStartRef = React.useRef(context);
  onDragStartRef.current = context;

  const onSetInvoicesRef = React.useRef(setInvoices);
  onSetInvoicesRef.current = setInvoices;

  useDragDropMonitor({
    onDragStart(event) {
      const src = (event.operation as unknown as Record<string, unknown>).source as
        { index?: number } | null | undefined;
      if (src != null && src.index != null) {
        onDragStartRef.current.current.sourceIndex = src.index;
      }
    },
    onDragEnd(event) {
      const op = event.operation as unknown as Record<string, unknown>;
      const source = op.source as { index?: number } | null | undefined;
      const target = op.target as { index?: number } | null | undefined;
      if (source == null || target == null) {
        return;
      }

      const fromIdx = onDragStartRef.current.current.sourceIndex;
      const toIdx = target.index ?? 0;

      if (fromIdx === toIdx || Number.isNaN(fromIdx) || Number.isNaN(toIdx)) {
        return;
      }

      onSetInvoicesRef.current((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
    },
  });

  return null;
}

export default function InvoiceMerge() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [invoices, setInvoices] = useState<InvoicePage[]>([]);
  const invoicesRef = useRef(invoices);
  const [perPage, setPerPage] = useState<2 | 4>(4);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const sortContextRef = useRef<SortContext>({ sourceIndex: -1 });

  // 保持 ref 与 state 同步
  useEffect(() => {
    invoicesRef.current = invoices;
  }, [invoices]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files === null || files.length === 0) {
      return;
    }

    if (files.length > MAX_FILES) {
      toast.warning(`单次最多选择 ${MAX_FILES} 个文件，当前选择了 ${files.length} 个`);
      return;
    }

    setLoading(true);
    // 清除之前的发票预览 URL
    for (const inv of invoicesRef.current) {
      if (inv.previewDataUrl != null && inv.previewDataUrl !== '') {
        URL.revokeObjectURL(inv.previewDataUrl);
      }
    }
    setInvoices([]);
    const newInvoices: InvoicePage[] = [];

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        toast.warning(`跳过非 PDF 文件：${file.name}`);
        continue;
      }
      try {
        const bytes = await readFileAsArrayBuffer(file);
        const previewUrl = await renderPreview(bytes);
        newInvoices.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          file,
          previewDataUrl: previewUrl,
        });
      } catch {
        toast.error(`读取失败：${file.name}`);
      }
    }

    setInvoices((prev) => [...prev, ...newInvoices]);
    setLoading(false);

    if (newInvoices.length > 0) {
      toast.success(`已添加 ${newInvoices.length} 个发票`);
    }

    if (fileInputRef.current !== null) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setInvoices((prev) => {
      const removed = prev[index];
      if (removed?.previewDataUrl != null && removed.previewDataUrl !== '') {
        URL.revokeObjectURL(removed.previewDataUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    for (const inv of invoices) {
      if (inv.previewDataUrl != null && inv.previewDataUrl !== '') {
        URL.revokeObjectURL(inv.previewDataUrl);
      }
    }
    setInvoices([]);
    toast.info('已清除全部发票');
  }, [invoices]);

  // --- 导出合并 PDF ---
  const handleExport = useCallback(async () => {
    if (invoices.length === 0) {
      toast.warning('请先添加发票');
      return;
    }

    setExporting(true);
    try {
      const mergedDoc = await PDFDocument.create();
      const slots = getLayoutSlots(perPage);
      const slotCount = slots.length;
      const totalPages = Math.ceil(invoices.length / slotCount);

      for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        const isLandscape = perPage === 4;
        const pageW = isLandscape ? A4_LANDSCAPE_WIDTH : A4_WIDTH;
        const pageH = isLandscape ? A4_LANDSCAPE_HEIGHT : A4_HEIGHT;
        const page = mergedDoc.addPage([pageW, pageH]);
        const startIdx = pageIdx * slotCount;
        const endIdx = Math.min(startIdx + slotCount, invoices.length);

        for (let slotIdx = 0; slotIdx < endIdx - startIdx; slotIdx++) {
          const invoice = invoices[startIdx + slotIdx];
          const slot = slots[slotIdx];

          try {
            const pdfBytes = await readFileAsArrayBuffer(invoice.file);
            const srcDoc = await PDFDocument.load(pdfBytes);
            const [embeddedPage] = await mergedDoc.embedPdf(srcDoc, [0]);

            // 获取原始页面尺寸
            const origPage = srcDoc.getPage(0);
            const { width: origW, height: origH } = origPage.getSize();

            // 按比例缩放以适配槽位
            const scaleX = slot.maxW / origW;
            const scaleY = slot.maxH / origH;
            const scale = Math.min(scaleX, scaleY);

            const scaledW = origW * scale;
            const scaledH = origH * scale;

            // 在槽位内居中
            const drawX = slot.x + (slot.maxW - scaledW) / 2;
            const drawY = slot.y + (slot.maxH - scaledH) / 2;

            page.drawPage(embeddedPage, {
              x: drawX,
              y: drawY,
              width: scaledW,
              height: scaledH,
            });
          } catch {
            toast.error(`合并失败：${invoice.fileName}`);
          }
        }
      }

      const pdfBytes = await mergedDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-invoices-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('导出成功');
    } catch {
      toast.error('导出失败');
    } finally {
      setExporting(false);
    }
  }, [invoices, perPage]);

  const totalPages =
    invoices.length === 0 ? 0 : Math.ceil(invoices.length / (perPage === 2 ? 2 : 4));

  return (
    <div className="size-full">
      <PageHeader />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            void handleFileSelect(e);
          }}
        />
        <Button size="lg" onClick={() => fileInputRef.current?.click()} disabled={loading}>
          <HugeiconsIcon icon={FileInputIcon} className="size-4" />
          {loading ? '读取中...' : '选择发票 PDF'}
        </Button>

        <Select
          items={PER_PAGE_CONFIG}
          value={String(perPage)}
          onValueChange={(v) => {
            if (v !== null) {
              setPerPage(Number(v) as 2 | 4);
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PER_PAGE_CONFIG.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {invoices.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              {invoices.length} 张发票，共 {totalPages} 页
            </span>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <HugeiconsIcon icon={Delete01Icon} className="size-4" />
              清除全部
            </Button>
            <Button
              size="sm"
              onClick={() => {
                void handleExport();
              }}
              disabled={exporting}
            >
              <HugeiconsIcon icon={Download01Icon} className="size-4" />
              {exporting ? '导出中...' : '导出合并 PDF'}
            </Button>
          </>
        )}
      </div>

      {invoices.length > 0 && (
        <DragDropProvider>
          <SortMonitor context={sortContextRef} setInvoices={setInvoices} />
          <div className="mt-6 space-y-4">
            {Array.from({ length: totalPages }, (_, pageIdx) => {
              const startIdx = pageIdx * perPage;
              const pageItems = invoices.slice(startIdx, startIdx + perPage);

              return (
                <div key={`page-${pageIdx}`}>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    第 {pageIdx + 1} 页（{pageItems.length}/{perPage}）
                  </div>
                  <div
                    className={`grid gap-3 ${perPage === 2 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}
                  >
                    {pageItems.map((inv, slotIdx) => {
                      const globalIdx = startIdx + slotIdx;
                      return (
                        <SortableInvoiceCard
                          key={inv.id}
                          inv={inv}
                          globalIdx={globalIdx}
                          onRemove={handleRemoveItem}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropProvider>
      )}

      {invoices.length === 0 && !loading && (
        <div className="mt-16 flex flex-col items-center justify-center text-muted-foreground">
          <HugeiconsIcon icon={Layers01Icon} className="mb-4 size-12 opacity-40" />
          <p className="text-sm">选择多个发票 PDF 文件进行合并</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            仅提取每个 PDF 的第一页，自动缩放排列到 A4 页面上
          </p>
          <div className="mt-4 max-w-md rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-center dark:border-amber-700 dark:bg-amber-950/50">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              💡 建议单次选择不超过 50
              个文件。文件过大或过多可能导致浏览器响应变慢，可分批处理以获得更好的体验。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

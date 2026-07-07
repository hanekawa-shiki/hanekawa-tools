import type parseTorrent from 'parse-torrent';
import {
  CheckIcon,
  Copy01Icon,
  Download01Icon,
  File01Icon,
  FileInputIcon,
  MagnetIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import dayjs from 'dayjs';
import { remote as parseTorrentRemote, toMagnetURI } from 'parse-torrent';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';

const MAX_FILES = 100;

async function parseTorrentFile(file: File): Promise<parseTorrent.Instance> {
  return new Promise((resolve, reject) => {
    parseTorrentRemote(file, (err, torrent) => {
      if (err !== undefined && err !== null) {
        reject(err);
      } else if (torrent === undefined || torrent === null) {
        reject(new Error('Invalid torrent file'));
      } else {
        resolve(torrent);
      }
    });
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(setCopied, 1500, false);
    });
  }, [text]);

  return (
    <div
      onClick={handleCopy}
      title="复制"
      className="inline-flex size-4 shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <HugeiconsIcon icon={CheckIcon} className="size-4 text-green-600" />
      ) : (
        <HugeiconsIcon icon={Copy01Icon} className="size-4" />
      )}
    </div>
  );
}

export default function Torrent2Magnet() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [torrents, setTorrents] = useState<TorrentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (files.length > MAX_FILES) {
      setErrorMsg(`单次最多允许选择 ${MAX_FILES} 个文件，当前已选择 ${files.length} 个`);
      return;
    }

    setErrorMsg('');

    const processFiles = async () => {
      setLoading(true);
      const results: TorrentInfo[] = [];

      for (const file of Array.from(files)) {
        try {
          const torrent = await parseTorrentFile(file);
          const magnet = toMagnetURI(torrent);
          results.push({
            fileName: file.name,
            magnet,
          });
        } catch {
          results.push({
            fileName: file.name,
            magnet: `[解析失败] ${file.name}`,
          });
          toast.error(`解析失败：${file.name}`);
        }
      }

      setTorrents(results);
      setLoading(false);

      if (results.length > 0) {
        const failedCount = results.filter((t) => t.magnet.startsWith('[解析失败]')).length;
        if (failedCount === 0) {
          toast.success(`成功解析 ${results.length} 个文件`);
        } else if (failedCount < results.length) {
          toast.warning(`部分解析成功：${results.length - failedCount} 成功，${failedCount} 失败`);
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    void processFiles();
  }, []);

  const handleExportToFile = useCallback(() => {
    const content = torrents.map((t) => t.magnet).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magnets_${dayjs().format('YYYYMMDDHHmmss')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('已导出磁力链接文件');
  }, [torrents]);

  const handleCopyAll = useCallback(() => {
    const content = torrents.map((t) => t.magnet).join('\n');
    void navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success('已复制全部磁力链接');
      })
      .catch(() => {
        toast.error('复制失败');
      });
  }, [torrents]);

  return (
    <div className="size-full">
      <PageHeader />
      <div className="mt-4 flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".torrent"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button size="lg" onClick={() => fileInputRef.current?.click()} disabled={loading}>
          <HugeiconsIcon icon={FileInputIcon} className="size-4" />
          {loading ? '解析中...' : '选择Torrent文件'}
        </Button>
        {torrents.length > 0 && (
          <span className="text-sm text-muted-foreground">
            已选择
            {torrents.length} 个文件
          </span>
        )}
      </div>

      {errorMsg && <div className="mt-2 text-sm text-destructive">{errorMsg}</div>}

      {torrents.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <HugeiconsIcon icon={File01Icon} className="size-4" />
              Torrent
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              {torrents.map((t) => (
                <div
                  key={`file-${t.fileName}`}
                  className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
                >
                  <HugeiconsIcon
                    icon={File01Icon}
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="truncate">{t.fileName}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <HugeiconsIcon icon={MagnetIcon} className="size-4" />
              Magnet
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              {torrents.map((t) => (
                <div
                  key={`magnet-${t.magnet}`}
                  className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
                >
                  <CopyButton text={t.magnet} />
                  <span className="min-w-0 flex-1 truncate text-sm">{t.magnet}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleExportToFile}>
                <HugeiconsIcon icon={Download01Icon} className="size-4" />
                导出内容到文件
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <HugeiconsIcon icon={Copy01Icon} className="size-4" />
                全部复制到剪切版
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { HomeIcon, RotateCcwIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      {/* 404 大字 */}
      <div className="relative">
        <span className="text-8xl font-extrabold tracking-tighter text-muted-foreground/20 select-none sm:text-9xl">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold text-muted-foreground">页面走丢了</span>
        </div>
      </div>

      {/* 描述 */}
      <p className="max-w-sm text-sm text-muted-foreground">
        你访问的页面不存在或已被移除，请检查地址是否正确。
      </p>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            void navigate('/');
          }}
          className="gap-2"
        >
          <HomeIcon className="size-4" />
          返回首页
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            void navigate(-1);
          }}
          className="gap-2"
        >
          <RotateCcwIcon className="size-4" />
          返回上页
        </Button>
      </div>
    </div>
  );
}

import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function SWUpdateToast() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('SW 注册失败:', error);
    },
  });

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);
  }, [setOfflineReady, setNeedRefresh]);

  useEffect(() => {
    if (offlineReady) {
      toast.info('应用已缓存，可离线使用');
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast('发现新版本', {
        description: '点击刷新以获取最新版本',
        duration: Infinity,
        action: {
          label: '刷新',
          onClick: () => {
            void updateServiceWorker(true);
          },
        },
        cancel: {
          label: '稍后',
          onClick: close,
        },
      });
    }
  }, [needRefresh, updateServiceWorker, close]);

  return null;
}

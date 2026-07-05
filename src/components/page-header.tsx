import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import config from '@/router/config';

export function PageHeader() {
  const location = useLocation();
  const meta = config.pageMeta?.[location.pathname];
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel == null) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (meta?.title == null) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'sticky top-0 z-10 -mx-4 -mt-4 flex flex-col bg-background px-4 pt-4 pb-2 backdrop-blur-sm transition-shadow lg:mx-0 lg:mt-0 lg:px-0 lg:py-4',
          scrolled && 'shadow-sm'
        )}
      >
        <h1 className="text-lg font-semibold">{meta.title}</h1>
        {meta.description != null && meta.description !== '' && (
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        )}
      </div>
      <div ref={sentinelRef} className="h-0" />
    </>
  );
}

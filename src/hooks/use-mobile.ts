import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const mql = React.useMemo(() => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`), []);
  const [isMobile, setIsMobile] = React.useState(mql.matches);

  React.useEffect(() => {
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mql]);

  return isMobile;
}

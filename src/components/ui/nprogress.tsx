
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export function NProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    handleStop(); // Stop progress on initial load

    return () => {
      handleStop(); // Ensure progress is stopped on unmount
    };
  }, []);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);
  
  // This is a component that attaches itself to the router events
  // and does not render anything.
  // We can use a fragment or null, but this is more explicit.
  return null;
}

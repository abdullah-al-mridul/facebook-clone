
'use client';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import React from 'react';

type LinkProps = NextLinkProps & {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, children, className, onClick, ...props }, ref) => {
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof href === 'string' && pathname !== href) {
      NProgress.start();
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <NextLink href={href} onClick={handleLinkClick} className={className} {...props} ref={ref}>
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';

export default Link;

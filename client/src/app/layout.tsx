
'use client';

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { NProgressBar } from '@/components/ui/nprogress';
import { useEffect, useState } from 'react';
import UniversalLoader from '@/components/ui/universal-loader';
import WelcomeDialog from '@/components/ui/welcome-dialog';

// export const metadata: Metadata = {
//   title: 'ChronoFeed',
//   description: 'A UI clone of Facebook\'s dark mode interface',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    // Simulate loading time and then hide the loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust time as needed

    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcomeDialog(true);
      localStorage.setItem('hasVisited', 'true');
    }

    return () => clearTimeout(timer);
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>ChronoFeed</title>
        <meta name="description" content="A UI clone of Facebook's dark mode interface" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {isLoading && <UniversalLoader />}
            <WelcomeDialog isOpen={showWelcomeDialog} onOpenChange={setShowWelcomeDialog} />
            <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
              <NProgressBar />
              <TooltipProvider>
                  {children}
              </TooltipProvider>
              <Toaster />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

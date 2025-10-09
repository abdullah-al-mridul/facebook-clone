
'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { StoryType } from '@/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import VerifiedBadge from './verified-badge';
import Link from 'next/link';

type StoryViewerProps = {
  stories: StoryType[];
  startIndex: number;
  onClose: () => void;
};

export default function StoryViewer({ stories, startIndex, onClose }: StoryViewerProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  
  useEffect(() => {
    if (api) {
        api.scrollTo(startIndex, true);
    }
  }, [api, startIndex]);
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-none p-0 max-w-md w-full h-full sm:h-auto sm:max-h-[95vh] sm:aspect-[9/16] sm:rounded-lg flex items-center justify-center">
       <DialogTitle className="sr-only">Story Viewer</DialogTitle>
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent className="h-full">
            {stories.map((story, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full w-full">
                   <Image
                        src={story.imageUrl}
                        alt={`Story by ${story.user.name}`}
                        fill
                        className="object-cover sm:rounded-lg"
                        data-ai-hint={story.imageHint}
                    />
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center gap-2">
                             <Link href="/profile" onClick={onClose}>
                                <Avatar className="h-9 w-9 border-2 border-white">
                                    <AvatarImage src={story.user.avatarUrl} alt={story.user.name} data-ai-hint="person portrait"/>
                                    <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <Link href="/profile" onClick={onClose}>
                                <span className="text-white font-semibold hover:underline">{story.user.name}</span>
                            </Link>
                             {story.user.isVerified && <VerifiedBadge />}
                        </div>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 text-white bg-white/20 hover:bg-white/30 border-none" />
          <CarouselNext className="right-2 text-white bg-white/20 hover:bg-white/30 border-none" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}


'use client';

import { useState, useEffect } from 'react';
import StoryCard from './story-card';
import CreateStoryDialog from './create-story-dialog';
import StoryViewer from './story-viewer';
import { StoryType } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '../ui/carousel';

const dummyStories: StoryType[] = [
    {
        id: 'story-1',
        user: { name: 'Sarah Miller', avatarUrl: 'https://picsum.photos/seed/story1/40/40', isVerified: true },
        imageUrl: 'https://picsum.photos/seed/story1/1080/1920',
        imageHint: 'vacation beach'
    },
    {
        id: 'story-2',
        user: { name: 'Michael Chen', avatarUrl: 'https://picsum.photos/seed/story2/40/40' },
        imageUrl: 'https://picsum.photos/seed/story2/1080/1920',
        imageHint: 'city skyline'
    },
    {
        id: 'story-3',
        user: { name: 'Emily Davis', avatarUrl: 'https://picsum.photos/seed/story3/40/40', isVerified: true },
        imageUrl: 'https://picsum.photos/seed/story3/1080/1920',
        imageHint: 'mountain hike'
    },
    {
        id: 'story-4',
        user: { name: 'David Rodriguez', avatarUrl: 'https://picsum.photos/seed/story4/40/40' },
        imageUrl: 'https://picsum.photos/seed/story4/1080/1920',
        imageHint: 'food delicious'
    },
    {
        id: 'story-5',
        user: { name: 'Jessica White', avatarUrl: 'https://picsum.photos/seed/story5/40/40' },
        imageUrl: 'https://picsum.photos/seed/story5/1080/1920',
        imageHint: 'concert music'
    },
    {
        id: 'story-6',
        user: { name: 'Chris Lee', avatarUrl: 'https://picsum.photos/seed/story6/40/40' },
        imageUrl: 'https://picsum.photos/seed/story6/1080/1920',
        imageHint: 'art museum'
    },
];

export default function StoryReel() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
    const [api, setApi] = useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    useEffect(() => {
        if (!api) {
        return
        }

        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
        
        const onSelect = () => {
            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        }
        api.on("select", onSelect)

        return () => {
            api.off("select", onSelect);
        }
    }, [api])


    const handleViewStory = (index: number) => {
        setViewingStoryIndex(index);
    }

    const handleCloseViewer = () => {
        setViewingStoryIndex(null);
    }

    return (
        <>
            <Carousel 
                setApi={setApi}
                opts={{
                    align: "start",
                    dragFree: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2">
                    <CarouselItem className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5">
                         <div className="h-48 sm:h-56">
                            <StoryCard isCreate onOpenCreate={() => setIsCreateOpen(true)}/>
                         </div>
                    </CarouselItem>
                    {dummyStories.map((story, index) => (
                        <CarouselItem key={story.id} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5">
                             <div className="h-48 sm:h-56">
                                <StoryCard 
                                    story={story} 
                                    onViewStory={() => handleViewStory(index)}
                                />
                             </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {canScrollPrev && <CarouselPrevious className="ml-10 hidden sm:flex" />}
                {canScrollNext && <CarouselNext className="mr-10 hidden sm:flex" />}
            </Carousel>
            <CreateStoryDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
            {viewingStoryIndex !== null && (
                <StoryViewer
                    stories={dummyStories}
                    startIndex={viewingStoryIndex}
                    onClose={handleCloseViewer}
                />
            )}
        </>
    );
}

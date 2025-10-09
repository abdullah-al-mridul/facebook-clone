
'use client';

import { useState } from 'react';
import StoryCard from './story-card';
import CreateStoryDialog from './create-story-dialog';
import StoryViewer from './story-viewer';
import { StoryType } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const dummyStories: StoryType[] = [
    {
        id: 'story-1',
        user: { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png', isVerified: true },
        imageUrl: 'https://picsum.photos/seed/story1/1080/1920',
        imageHint: 'vacation beach'
    },
    {
        id: 'story-2',
        user: { name: 'Michael Chen', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' },
        imageUrl: 'https://picsum.photos/seed/story2/1080/1920',
        imageHint: 'city skyline'
    },
    {
        id: 'story-3',
        user: { name: 'Emily Davis', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png', isVerified: true },
        imageUrl: 'https://picsum.photos/seed/story3/1080/1920',
        imageHint: 'mountain hike'
    },
    {
        id: 'story-4',
        user: { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/40x40.png' },
        imageUrl: 'https://picsum.photos/seed/story4/1080/1920',
        imageHint: 'food delicious'
    },
    {
        id: 'story-5',
        user: { name: 'Jessica White', avatarUrl: 'https://placehold.co/40x40/D1D5DB/374151.png' },
        imageUrl: 'https://picsum.photos/seed/story5/1080/1920',
        imageHint: 'concert music'
    },
    {
        id: 'story-6',
        user: { name: 'Chris Lee', avatarUrl: 'https://placehold.co/40x40/4B5563/E5E7EB.png' },
        imageUrl: 'https://picsum.photos/seed/story6/1080/1920',
        imageHint: 'art museum'
    },
];

export default function StoryReel() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

    const handleViewStory = (index: number) => {
        setViewingStoryIndex(index);
    }

    const handleCloseViewer = () => {
        setViewingStoryIndex(null);
    }

    return (
        <>
            <Carousel 
                opts={{
                    align: "start",
                    dragFree: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2">
                    <CarouselItem className="pl-2 basis-1/4 sm:basis-1/4 md:basis-1/5">
                         <div className="h-56">
                            <StoryCard isCreate onOpenCreate={() => setIsCreateOpen(true)}/>
                         </div>
                    </CarouselItem>
                    {dummyStories.map((story, index) => (
                        <CarouselItem key={story.id} className="pl-2 basis-1/4 sm:basis-1/4 md:basis-1/5">
                             <div className="h-56">
                                <StoryCard 
                                    story={story} 
                                    onViewStory={() => handleViewStory(index)}
                                />
                             </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-10" />
                <CarouselNext className="mr-10" />
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

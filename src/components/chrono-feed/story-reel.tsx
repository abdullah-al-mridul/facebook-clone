
'use client';

import { useState } from 'react';
import StoryCard from './story-card';
import CreateStoryDialog from './create-story-dialog';
import StoryViewer from './story-viewer';
import { StoryType } from '@/types';

const dummyStories: StoryType[] = [
    {
        id: 'story-1',
        user: { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png', isVerified: true },
        imageUrl: 'https://placehold.co/1080x1920/9CA3AF/FFFFFF.png',
        imageHint: 'vacation beach'
    },
    {
        id: 'story-2',
        user: { name: 'Michael Chen', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' },
        imageUrl: 'https://placehold.co/1080x1920/F3F4F6/1F2937.png',
        imageHint: 'city skyline'
    },
    {
        id: 'story-3',
        user: { name: 'Emily Davis', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png', isVerified: true },
        imageUrl: 'https://placehold.co/1080x1920/D1D5DB/374151.png',
        imageHint: 'mountain hike'
    },
    {
        id: 'story-4',
        user: { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/40x40.png' },
        imageUrl: 'https://placehold.co/1080x1920/4B5563/E5E7EB.png',
        imageHint: 'food delicious'
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
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 h-56">
                <StoryCard isCreate onOpenCreate={() => setIsCreateOpen(true)}/>
                {dummyStories.map((story, index) => (
                    <StoryCard 
                        key={story.id} 
                        story={story} 
                        onViewStory={() => handleViewStory(index)}
                    />
                ))}
            </div>
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

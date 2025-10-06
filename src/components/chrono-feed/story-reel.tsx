
'use client';

import { useState } from 'react';
import StoryCard from './story-card';
import CreateStoryDialog from './create-story-dialog';

const dummyStories = [
    {
        id: 'story-1',
        user: { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png', isVerified: true },
        imageUrl: 'https://placehold.co/200x320/9CA3AF/FFFFFF.png',
        imageHint: 'vacation beach'
    },
    {
        id: 'story-2',
        user: { name: 'Michael Chen', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' },
        imageUrl: 'https://placehold.co/200x320/F3F4F6/1F2937.png',
        imageHint: 'city skyline'
    },
    {
        id: 'story-3',
        user: { name: 'Emily Davis', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png', isVerified: true },
        imageUrl: 'https://placehold.co/200x320/D1D5DB/374151.png',
        imageHint: 'mountain hike'
    },
    {
        id: 'story-4',
        user: { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/40x40.png' },
        imageUrl: 'https://placehold.co/200x320/4B5563/E5E7EB.png',
        imageHint: 'food delicious'
    },
];

export default function StoryReel() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 h-52">
                <StoryCard isCreate onOpenCreate={() => setIsCreateOpen(true)}/>
                {dummyStories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>
            <CreateStoryDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </>
    );
}

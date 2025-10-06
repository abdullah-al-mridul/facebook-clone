
'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Card, CardFooter, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { StoryType } from '@/types';

type StoryCardProps = {
    story?: StoryType;
    isCreate?: boolean;
    onOpenCreate?: () => void;
};

export default function StoryCard({ story, isCreate = false, onOpenCreate }: StoryCardProps) {
  if (isCreate) {
    return (
        <Card className="overflow-hidden h-full flex flex-col group cursor-pointer" onClick={onOpenCreate}>
            <div className="relative flex-1 bg-card">
                 <Image src="https://placehold.co/200x320.png" alt="Current User" fill objectFit="cover" className="opacity-75 group-hover:opacity-100 transition-opacity" data-ai-hint="profile person"/>
            </div>
            <CardFooter className="flex-col p-2 h-[60px] justify-center relative bg-card">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center border-4 border-card text-primary-foreground">
                    <Plus className="h-6 w-6"/>
                </div>
                <p className="font-semibold text-sm pt-4">Create Story</p>
            </CardFooter>
        </Card>
    );
  }

  if (!story) return null;

  return (
    <Card className="overflow-hidden group cursor-pointer relative h-full">
        <Image src={story.imageUrl} alt={story.user.name} fill objectFit="cover" className="transition-transform group-hover:scale-105" data-ai-hint={story.imageHint}/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-2 left-2">
             <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage src={story.user.avatarUrl} alt={story.user.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white text-sm font-semibold truncate">{story.user.name}</p>
        </div>
    </Card>
  );
}

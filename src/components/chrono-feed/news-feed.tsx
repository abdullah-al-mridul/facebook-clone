
'use client';
import { useState } from 'react';
import CreatePost from './create-post';
import Post from './post';
import PostDialog from './post-dialog';
import { samplePosts } from '@/lib/data';
import StoryReel from './story-reel';


export default function NewsFeed() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <StoryReel />
      <CreatePost onOpenDialog={() => setIsDialogOpen(true)} />
      {samplePosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <PostDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}


'use client';
import { useState } from 'react';
import CreatePost from './create-post';
import Post from './post';
import PostDialog from './post-dialog';
import { samplePosts } from '@/lib/data';


export default function NewsFeed() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <CreatePost onOpenDialog={() => setIsDialogOpen(true)} />
      {samplePosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <PostDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}

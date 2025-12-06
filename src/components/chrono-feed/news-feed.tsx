
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import CreatePost from './create-post';
import Post from './post';
import PostDialog from './post-dialog';
import { samplePosts } from '@/lib/data';
import StoryReel from './story-reel';
import { PostType } from '@/types';
import { Loader2 } from 'lucide-react';

export default function NewsFeed() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [posts, setPosts] = useState<PostType[]>(samplePosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const loadMorePosts = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newPosts = samplePosts.map(p => ({ ...p, id: `${p.id}-${Math.random()}` }));
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      // In a real app, you'd check if the API returned more posts
      // For this demo, we'll just stop after a few loads.
      setHasMore(posts.length < 15); 
      setIsLoading(false);
    }, 1500); // Simulate network delay
  };

  return (
    <div className="space-y-6">
      <StoryReel />
      <CreatePost onOpenDialog={() => setIsDialogOpen(true)} />
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return <div ref={lastPostElementRef} key={post.id}><Post post={post} /></div>;
        }
        return <Post key={post.id} post={post} />;
      })}

      {isLoading && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && !isLoading && (
        <div className="text-center text-muted-foreground p-4">
          <p>You've reached the end of the feed.</p>
        </div>
      )}

      <PostDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}

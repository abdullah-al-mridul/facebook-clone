
'use client';
import Image from 'next/image';
import type { PostType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import CommentOverlay from './comment-overlay';

type PostProps = {
  post: PostType;
  isOverlay?: boolean;
};

const Reaction = ({ children }: { children: React.ReactNode }) => (
  <span className="text-2xl cursor-pointer transition-transform hover:scale-125">{children}</span>
);

export default function Post({ post, isOverlay = false }: PostProps) {
  const [reaction, setReaction] = useState('Like');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCommentOverlayOpen, setIsCommentOverlayOpen] = useState(false);

  const handleReaction = (newReaction: string) => {
    setReaction(newReaction);
    setIsPopoverOpen(false);
  }
  
  const PostWrapper = isOverlay ? 'div' : Card;

  return (
    <>
    <PostWrapper className={!isOverlay ? 'shadow-sm' : ''}>
      <CardHeader className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatarUrl} alt={post.user.name} data-ai-hint="person portrait" />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.user.name}</p>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
          {!isOverlay && (
            <Button variant="ghost" size="icon">
                <MoreHorizontal />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && (
          <div className={`relative ${!isOverlay && '-mx-4'}`}>
             <Image 
              src={post.imageUrl} 
              alt="Post image" 
              width={isOverlay ? 800 : 572}
              height={isOverlay ? 600 : 400}
              className="w-full h-auto object-cover" 
              data-ai-hint={post.imageHint}
            />
          </div>
        )}
      </CardContent>

      <div className="px-4 pb-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4 text-primary" />
            <span>{post.likes}</span>
          </div>
          <div className="flex gap-4">
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </div>
      </div>

      {!isOverlay && (
        <>
        <Separator className="mx-4 w-auto" />

        <CardFooter className="p-1">
          <div className="flex justify-around w-full">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
                  <ThumbsUp />
                  {reaction}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-card p-2 rounded-full">
                <div className="flex gap-2">
                  <Reaction><span onClick={() => handleReaction('👍 Like')}>👍</span></Reaction>
                  <Reaction><span onClick={() => handleReaction('❤️ Love')}>❤️</span></Reaction>
                  <Reaction><span onClick={() => handleReaction('😂 Haha')}>😂</span></Reaction>
                  <Reaction><span onClick={() => handleReaction('😮 Wow')}>😮</span></Reaction>
                  <Reaction><span onClick={() => handleReaction('😢 Sad')}>😢</span></Reaction>
                  <Reaction><span onClick={() => handleReaction('😡 Angry')}>😡</span></Reaction>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={() => setIsCommentOverlayOpen(true)}>
              <MessageSquare />
              Comment
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
              <Share2 />
              Share
            </Button>
          </div>
        </CardFooter>
        </>
      )}
    </PostWrapper>
    {!isOverlay && <CommentOverlay post={post} isOpen={isCommentOverlayOpen} onOpenChange={setIsCommentOverlayOpen} />}
    </>
  );
}

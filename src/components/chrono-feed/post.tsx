
'use client';
import Image from 'next/image';
import type { PostType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp, Eye, BarChart2, Globe, Users, Lock, Bookmark, Pencil, Trash2, Flag } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import CommentOverlay from './comment-overlay';
import ShareOverlay from './share-overlay';
import VerifiedBadge from './verified-badge';
import Link from '@/components/ui/link';
import PostAnalytics from './post-analytics';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import ReactionOverlay from './reaction-overlay';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

type PostProps = {
  post: PostType;
  isOverlay?: boolean;
};

const reactions = [
    { name: 'Like', icon: '/like.png' },
    { name: 'Love', icon: '/love.png' },
    { name: 'Haha', icon: '/haha.png' },
    { name: 'Wow', icon: '/wow.png' },
    { name: 'Sad', icon: '/sad.png' },
    { name: 'Angry', icon: '/angry.png' },
]

const privacyIcons = {
    'Public': Globe,
    'Friends': Users,
    'Only Me': Lock
}

const Reaction = ({ children, onClick, name }: { children: React.ReactNode, onClick: () => void; name: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <div
                onClick={onClick}
                className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
            >
                {children}
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{name}</p>
        </TooltipContent>
    </Tooltip>
);

export default function Post({ post, isOverlay = false }: PostProps) {
  const [selectedReaction, setSelectedReaction] = useState(reactions[0]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCommentOverlayOpen, setIsCommentOverlayOpen] = useState(false);
  const [isShareOverlayOpen, setIsShareOverlayOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isReactionOverlayOpen, setIsReactionOverlayOpen] = useState(false);

  const handleReactionSelect = (reactionName: string) => {
    const reaction = reactions.find(r => r.name === reactionName);
    if (reaction) {
        setSelectedReaction(reaction);
    }
    setIsPopoverOpen(false);
  }
  
  const PostWrapper = isOverlay ? 'div' : Card;
  const PrivacyIcon = privacyIcons[post.privacy];

  return (
    <>
    <PostWrapper className={!isOverlay ? 'shadow-sm' : ''}>
      <CardHeader className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Avatar>
                <AvatarImage src={post.user.avatarUrl} alt={post.user.name} data-ai-hint="person portrait" />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-1">
                <Link href="/profile">
                    <p className="font-semibold hover:underline">{post.user.name}</p>
                </Link>
                {post.user.isVerified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{post.timestamp}</span>
                <Tooltip>
                    <TooltipTrigger>
                        <PrivacyIcon className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{post.privacy}</p>
                    </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          {!isOverlay && (
            <div className="flex items-center">
                <Link href={`/post/${post.id}`}>
                    <Button variant="ghost" size="icon" title="View Post">
                        <Eye />
                    </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save Post
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      Report Post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
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
          <div className="flex items-center gap-1 cursor-pointer hover:underline" onClick={() => setIsReactionOverlayOpen(true)}>
            <ThumbsUp className="w-4 h-4 text-primary" />
            <span>{post.likes}</span>
          </div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:underline" onClick={() => setIsCommentOverlayOpen(true)}>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </div>
      </div>

      {showAnalytics && post.analytics && <PostAnalytics analytics={post.analytics} />}

      {!isOverlay && (
        <>
        <Separator className="mx-4 w-auto" />

        <CardFooter className="p-1">
          <div className="flex justify-around w-full">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
                    {selectedReaction.name === 'Like' ? (
                        <ThumbsUp />
                    ) : (
                        <Image src={selectedReaction.icon} alt={selectedReaction.name} width={20} height={20} />
                    )}
                    <span className={cn(
                        selectedReaction.name === 'Love' && 'text-red-500',
                        selectedReaction.name === 'Haha' && 'text-yellow-500',
                        selectedReaction.name === 'Wow' && 'text-yellow-500',
                        selectedReaction.name === 'Sad' && 'text-yellow-500',
                        selectedReaction.name === 'Angry' && 'text-orange-500',
                    )}>
                        {selectedReaction.name}
                    </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-card p-2 rounded-full">
                <div className="flex gap-2">
                  {reactions.map(reaction => (
                    <Reaction key={reaction.name} onClick={() => handleReactionSelect(reaction.name)} name={reaction.name}>
                        <Image src={reaction.icon} alt={reaction.name} width={40} height={40} unoptimized />
                    </Reaction>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={() => setIsCommentOverlayOpen(true)}>
              <MessageSquare />
              Comment
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={() => setIsShareOverlayOpen(true)}>
              <Share2 />
              Share
            </Button>
             <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={() => setShowAnalytics(!showAnalytics)}>
              <BarChart2 />
              Insights
            </Button>
          </div>
        </CardFooter>
        </>
      )}
    </PostWrapper>
    {!isOverlay && <CommentOverlay post={post} isOpen={isCommentOverlayOpen} onOpenChange={setIsCommentOverlayOpen} />}
    {!isOverlay && <ShareOverlay post={post} isOpen={isShareOverlayOpen} onOpenChange={setIsShareOverlayOpen} />}
    {!isOverlay && <ReactionOverlay post={post} isOpen={isReactionOverlayOpen} onOpenChange={setIsReactionOverlayOpen} />}
    </>
  );
}

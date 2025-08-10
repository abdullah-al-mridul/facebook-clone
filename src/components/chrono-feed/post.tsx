import Image from 'next/image';
import type { PostType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp } from 'lucide-react';

type PostProps = {
  post: PostType;
};

export default function Post({ post }: PostProps) {
  return (
    <Card>
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
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && (
          <div className="relative -mx-4">
             <Image 
              src={post.imageUrl} 
              alt="Post image" 
              width={572} 
              height={400} 
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

      <Separator className="mx-4 w-auto" />

      <CardFooter className="p-1">
        <div className="flex justify-around w-full">
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
            <ThumbsUp />
            Like
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
            <MessageSquare />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
            <Share2 />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

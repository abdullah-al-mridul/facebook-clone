
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostType } from "@/types";
import Post from "./post";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Separator } from "../ui/separator";
import VerifiedBadge from "./verified-badge";
import Link from '@/components/ui/link';

type CommentOverlayProps = {
  post: PostType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const Comment = ({ comment }: { comment: NonNullable<PostType['commentData']>[0] }) => (
    <div className="flex items-start gap-3">
        <Link href="/profile">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="bg-accent rounded-lg p-2 flex-1">
            <div className="flex items-center gap-1">
                <Link href="/profile">
                    <p className="font-semibold text-sm hover:underline">{comment.user.name}</p>
                </Link>
                {comment.user.isVerified && <VerifiedBadge />}
            </div>
            <p className="text-sm">{comment.content}</p>
        </div>
    </div>
)

export default function CommentOverlay({ post, isOpen, onOpenChange }: CommentOverlayProps) {
  if (!post) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
             <Link href="/profile" className="hover:underline">
                <span>{post.user.name}'s Post</span>
              </Link>
            {post.user.isVerified && <VerifiedBadge />}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
            <div className="p-0">
                <Post post={post} isOverlay/>
            </div>
            <Separator />
            <div className="p-4 space-y-4">
                {post.commentData?.map((comment) => (
                   <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
        <div className="p-4 border-t bg-card">
            <div className="flex items-center gap-3">
                 <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="relative w-full">
                    <Input placeholder="Write a comment..." className="pr-10 bg-accent rounded-full"/>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-5 w-5 text-primary"/>
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

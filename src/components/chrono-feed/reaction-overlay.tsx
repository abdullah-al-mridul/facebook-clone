
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PostType, ReactionType, ReactionName } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import VerifiedBadge from "./verified-badge";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";

type ReactionOverlayProps = {
  post: PostType;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const reactionIcons: Record<ReactionName, string> = {
    Like: '/like.png',
    Love: '/love.png',
    Haha: '/haha.png',
    Wow: '/wow.png',
    Sad: '/sad.png',
    Angry: '/angry.png',
}

const ReactionItem = ({ reaction }: { reaction: ReactionType }) => (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
        <div className="flex items-center gap-3">
            <Link href="/profile">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={reaction.user.avatarUrl} alt={reaction.user.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{reaction.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex items-center gap-1">
                <Link href="/profile">
                    <p className="font-semibold text-sm hover:underline">{reaction.user.name}</p>
                </Link>
                {reaction.user.isVerified && <VerifiedBadge />}
            </div>
        </div>
        <Image src={reactionIcons[reaction.reaction]} alt={reaction.reaction} width={24} height={24} />
    </div>
)

export default function ReactionOverlay({ post, isOpen, onOpenChange }: ReactionOverlayProps) {
  if (!post) return null;

  const allReactions = post.reactions || [];
  const reactionTabs: ReactionName[] = ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'];
  
  const getReactionsByName = (name: ReactionName) => {
    return allReactions.filter(r => r.reaction === name);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reactions</DialogTitle>
          <DialogDescription>People who reacted to this post.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7 h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                {reactionTabs.map(name => {
                    const reactions = getReactionsByName(name);
                    if (reactions.length === 0) return null;
                    return (
                        <TabsTrigger key={name} value={name} className="relative">
                            <Image src={reactionIcons[name]} alt={name} width={20} height={20} />
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {reactions.length}
                            </span>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
            <TabsContent value="all" className="max-h-80 overflow-y-auto space-y-1 pr-2">
                 {allReactions.map((reaction, index) => (
                   <ReactionItem key={index} reaction={reaction} />
                ))}
            </TabsContent>
             {reactionTabs.map(name => {
                 const reactions = getReactionsByName(name);
                 if (reactions.length === 0) return null;
                 return (
                    <TabsContent key={name} value={name} className="max-h-80 overflow-y-auto space-y-1 pr-2">
                        {reactions.map((reaction, index) => (
                            <ReactionItem key={index} reaction={reaction} />
                        ))}
                    </TabsContent>
                 )
             })}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

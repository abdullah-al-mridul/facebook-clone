
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Image, Smile, Video, User } from 'lucide-react';

type PostDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function PostDialog({ isOpen, onOpenChange }: PostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Current User</p>
            <p className="text-xs text-muted-foreground">Public</p>
          </div>
        </div>
        <Textarea
          placeholder="What's on your mind?"
          className="min-h-[120px] text-lg border-none focus-visible:ring-0"
        />
        <div className="flex justify-between items-center p-2 border rounded-lg">
            <span>Add to your post</span>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Image className="h-6 w-6 text-green-500" /></Button>
                <Button variant="ghost" size="icon"><User className="h-6 w-6 text-blue-500" /></Button>
                <Button variant="ghost" size="icon"><Smile className="h-6 w-6 text-yellow-500" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-6 w-6 text-red-500" /></Button>
            </div>
        </div>
        <Button className="w-full">Post</Button>
      </DialogContent>
    </Dialog>
  );
}


'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

type InviteFriendsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const dummyFriends: User[] = [
    { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/100x100/E5E7EB/4B5563.png' },
    { name: 'Michael Chen', avatarUrl: 'https://placehold.co/100x100/9CA3AF/FFFFFF.png' },
    { name: 'Emily Davis', avatarUrl: 'https://placehold.co/100x100/F3F4F6/1F2937.png' },
    { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/100x100.png' },
    { name: 'Jessica White', avatarUrl: 'https://placehold.co/100x100/D1D5DB/374151.png' },
    { name: 'Chris Lee', avatarUrl: 'https://placehold.co/100x100/4B5563/E5E7EB.png' },
    { name: 'Amanda Taylor', avatarUrl: 'https://placehold.co/100x100/FFFFFF/9CA3AF.png' },
    { name: 'James Brown', avatarUrl: 'https://placehold.co/100x100/1F2937/F3F4F6.png' },
];

const FriendItem = ({ user }: { user: User }) => {
    const [invited, setInvited] = useState(false);
    return (
         <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{user.name}</span>
            </div>
            <Button 
                variant={invited ? "secondary" : "default"} 
                onClick={() => setInvited(!invited)}
                disabled={invited}
            >
                {invited ? 'Invited' : 'Invite'}
            </Button>
        </div>
    )
}

export default function InviteFriendsDialog({ isOpen, onOpenChange }: InviteFriendsDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invite Friends</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search friends" className="pl-10 bg-accent rounded-full" />
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {dummyFriends.map(friend => (
                <FriendItem key={friend.name} user={friend} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

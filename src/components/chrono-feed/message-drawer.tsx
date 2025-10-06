
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { User } from '@/types';
import VerifiedBadge from './verified-badge';
import Link from 'next/link';

const dummyUsers: User[] = [
  { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png', isVerified: true },
  { name: 'Michael Chen', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' },
  { name: 'Emily Davis', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png', isVerified: true },
  { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/40x40.png' },
  { name: 'Jessica White', avatarUrl: 'https://placehold.co/40x40/D1D5DB/374151.png' },
];

const dummyMessages = dummyUsers.map((user, index) => ({
    id: `${index + 1}`,
    user: user,
    lastMessage: [
        'Sounds good! See you then.',
        'Haha, that\'s hilarious!',
        'Can you send me the file?',
        'You: Check out this link!',
        'Happy Birthday! 🎉',
    ][index],
    timestamp: ['5m', '1h', '3h', 'yesterday', '2d'][index],
    unread: [true, false, true, false, false][index]
}))


const MessageItem = ({ message, onUserSelect }: { message: typeof dummyMessages[0], onUserSelect: (user: User) => void }) => (
    <div onClick={() => onUserSelect(message.user)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
      <Link href="/profile" onClick={(e) => e.stopPropagation()}>
        <Avatar className="h-14 w-14">
          <AvatarImage src={message.user.avatarUrl} alt={message.user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-1">
          <Link href="/profile" onClick={(e) => e.stopPropagation()} className="hover:underline">
            <p className="font-semibold truncate">{message.user.name}</p>
          </Link>
          {message.user.isVerified && <VerifiedBadge />}
        </div>
        <p className={`text-sm truncate ${message.unread ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
            {message.lastMessage}
        </p>
      </div>
      <div className="flex flex-col items-end text-xs text-muted-foreground">
        <span>{message.timestamp}</span>
        {message.unread && <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1"></div>}
      </div>
    </div>
);


type MessageDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUserSelect: (user: User) => void;
};

export default function MessageDrawer({ isOpen, onOpenChange, onUserSelect }: MessageDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[400px] p-4 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Chats</SheetTitle>
        </SheetHeader>
        <div className="relative my-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search messages" className="pl-10 bg-accent rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto -mr-4 pr-4">
            <div className="flex flex-col gap-1">
                {dummyMessages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} onUserSelect={onUserSelect} />
                ))}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

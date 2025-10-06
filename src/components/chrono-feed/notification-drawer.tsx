
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { User } from '@/types';
import VerifiedBadge from './verified-badge';

type NotificationType = 'like' | 'comment';

type DummyNotification = {
    id: string;
    type: NotificationType;
    user: User;
    content: string;
    timestamp: string;
    isRead: boolean;
}

const dummyNotifications: DummyNotification[] = [
  { id: '1', type: 'like', user: { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png', isVerified: true }, content: 'liked your photo.', timestamp: '15m', isRead: false },
  { id: '2', type: 'comment', user: { name: 'Michael Chen', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' }, content: 'commented: "Looks great!"', timestamp: '1h', isRead: false },
  { id: '3', type: 'like', user: { name: 'Emily Davis', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png', isVerified: true }, content: 'liked your post.', timestamp: '3h', isRead: true },
  { id: '4', type: 'comment', user: { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/40x40.png' }, content: 'also commented on a post.', timestamp: 'yesterday', isRead: true },
  { id: '5', type: 'like', user: { name: 'Jessica White', avatarUrl: 'https://placehold.co/40x40/D1D5DB/374151.png' }, content: 'liked your comment.', timestamp: '2d', isRead: true },
];

const NotificationIcon = ({ type }: { type: NotificationType }) => {
    const iconClasses = "h-5 w-5 text-white";
    if (type === 'like') {
        return <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-card"><ThumbsUp className={iconClasses} /></div>;
    }
    return <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-card"><MessageCircle className={iconClasses} /></div>;
}


const NotificationItem = ({ notification }: { notification: DummyNotification }) => (
    <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${!notification.isRead ? 'bg-accent/50 hover:bg-accent' : 'hover:bg-accent'}`}>
        <div className="relative">
            <Avatar className="h-14 w-14">
                <AvatarImage src={notification.user.avatarUrl} alt={notification.user.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <NotificationIcon type={notification.type} />
        </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm">
            <span className="font-semibold">{notification.user.name}</span>
            {notification.user.isVerified && <VerifiedBadge inline />}
            {' '}{notification.content}
        </p>
        <p className={`text-xs ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`}>
            {notification.timestamp}
        </p>
      </div>
      {!notification.isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
    </div>
);


type NotificationDrawerProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function NotificationDrawer({ isOpen, onOpenChange }: NotificationDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[400px] p-4 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mr-4 pr-4 mt-4">
            <div className="flex flex-col gap-2">
                {dummyNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

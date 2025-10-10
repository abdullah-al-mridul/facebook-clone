
'use client';

import { useState } from 'react';
import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import Chatbox from '@/components/chrono-feed/chatbox';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VerifiedBadge from '@/components/chrono-feed/verified-badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

const dummyUsers: User[] = [
  { name: 'Sarah Miller', avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png', isVerified: true },
  { name: 'Michael Chen', avatarUrl: 'https://placehold.co/40x40/9CA3AF/FFFFFF.png' },
  { name: 'Emily Davis', avatarUrl: 'https://placehold.co/40x40/F3F4F6/1F2937.png', isVerified: true },
  { name: 'David Rodriguez', avatarUrl: 'https://placehold.co/40x40.png' },
  { name: 'Jessica White', avatarUrl: 'https://placehold.co/40x40/D1D5DB/374151.png' },
  { name: 'Chris Lee', avatarUrl: 'https://placehold.co/100x100/4B5563/E5E7EB.png' },
  { name: 'Amanda Taylor', avatarUrl: 'https://placehold.co/100x100/FFFFFF/9CA3AF.png' },
  { name: 'James Brown', avatarUrl: 'https://placehold.co/100x100/1F2937/F3F4F6.png' },
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
        'Just checking in.',
        'Are we still on for tomorrow?',
        'Loved your last post!',
    ][index],
    timestamp: ['5m', '1h', '3h', 'yesterday', '2d', '3d', '4d', '5d'][index],
    unread: [true, false, true, false, false, false, false, false][index]
}));

const ConversationItem = ({ message, onUserSelect, isActive }: { message: typeof dummyMessages[0], onUserSelect: (user: User) => void, isActive: boolean }) => (
    <div onClick={() => onUserSelect(message.user)} className={cn("flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer", isActive && "bg-accent")}>
      <Link href="/profile" onClick={(e) => e.stopPropagation()}>
        <Avatar className="h-14 w-14">
          <AvatarImage src={message.user.avatarUrl} alt={message.user.name} data-ai-hint="person portrait" />
          <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-1">
          <p className="font-semibold truncate">{message.user.name}</p>
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


export default function MessagesPage() {
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [openChats, setOpenChats] = useState<ChatWindowState[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(dummyMessages[0].user);

  const handleUserSelect = (user: User) => {
    setIsMessageDrawerOpen(false);
    const existingChat = openChats.find(chat => chat.user.name === user.name);
    if (existingChat) {
      if (existingChat.isMinimized) {
        setOpenChats(prevChats =>
          prevChats.map(chat =>
            chat.user.name === user.name ? { ...chat, isMinimized: false } : chat
          )
        );
      }
    } else {
       if (openChats.length < 3) {
        setOpenChats(prevChats => [...prevChats, { user, isMinimized: false }]);
       }
    }
  };

  const closeChat = (userName: string) => {
    setOpenChats(prevChats => prevChats.filter(chat => chat.user.name !== userName));
  };

  const toggleMinimize = (userName: string) => {
    setOpenChats(prevChats =>
      prevChats.map(chat =>
        chat.user.name === userName ? { ...chat, isMinimized: !chat.isMinimized } : chat
      )
    );
  };
  
  const minimizedChats = openChats.filter(chat => chat.isMinimized);
  const expandedChats = openChats.filter(chat => !chat.isMinimized);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMessagesClick={() => setIsMessageDrawerOpen(true)}
        onNotificationsClick={() => setIsNotificationDrawerOpen(true)}
      />
       <MessageDrawer 
        isOpen={isMessageDrawerOpen} 
        onOpenChange={setIsMessageDrawerOpen}
        onUserSelect={handleUserSelect}
      />
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onOpenChange={setIsNotificationDrawerOpen}
      />
      <div className="flex h-screen pt-14">
        <div className="fixed top-14 left-0 h-[calc(100vh-56px)] w-72 hidden lg:block">
          <LeftSidebar />
        </div>
        
        <div className="flex flex-1 lg:pl-72 h-full">
            {/* Left Column - Conversation List */}
            <div className="w-full md:w-2/5 xl:w-1/3 border-r h-full flex-col hidden md:flex">
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold">Chats</h1>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="Search messages" className="pl-10 bg-accent rounded-full" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {dummyMessages.map(msg => (
                        <ConversationItem 
                            key={msg.id} 
                            message={msg} 
                            onUserSelect={setSelectedUser}
                            isActive={selectedUser?.name === msg.user.name}
                        />
                    ))}
                </div>
            </div>

            {/* Right Column - Chat View */}
            <main className="flex-1 h-full flex items-center justify-center">
                {selectedUser ? (
                     <div className="h-full w-full">
                        <Chatbox 
                            user={selectedUser} 
                            onClose={() => setSelectedUser(null)} 
                            onMinimize={() => {
                                handleUserSelect(selectedUser);
                                setSelectedUser(null);
                            }}
                        />
                     </div>
                ) : (
                    <Card className="text-center p-8">
                        <h2 className="text-xl font-semibold">Select a chat</h2>
                        <p className="text-muted-foreground">Choose one of your existing conversations to start chatting.</p>
                    </Card>
                )}
            </main>
        </div>
      </div>
      <div className="fixed bottom-0 right-4 flex items-end gap-4 z-40">
        {minimizedChats.map((chat) => (
            <MinimizedChat 
              key={chat.user.name} 
              user={chat.user} 
              onClose={() => closeChat(chat.user.name)}
              onExpand={() => toggleMinimize(chat.user.name)}
              />
        ))}
        {expandedChats.map((chat) => (
            <Chatbox 
              key={chat.user.name} 
              user={chat.user} 
              onClose={() => closeChat(chat.user.name)} 
              onMinimize={() => toggleMinimize(chat.user.name)}
            />
        ))}
      </div>
    </div>
  );
}

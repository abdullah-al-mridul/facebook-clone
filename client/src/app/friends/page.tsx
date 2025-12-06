
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import { useState } from 'react';
import Chatbox from '@/components/chrono-feed/chatbox';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';
import FriendCard from '@/components/chrono-feed/friend-card';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
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

export default function FriendsPage() {
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [openChats, setOpenChats] = useState<ChatWindowState[]>([]);

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
      <div className="flex">
        <div className="fixed top-14 left-0 h-[calc(100vh-56px)] w-72 hidden lg:block">
          <LeftSidebar />
        </div>
        <main className="flex-1 lg:pl-72 pt-14">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Friends</h1>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dummyFriends.map((friend) => (
                    <FriendCard key={friend.name} user={friend} />
                ))}
            </div>
          </div>
        </main>
      </div>
      <div className="fixed bottom-0 right-4 flex items-end gap-4">
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

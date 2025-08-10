
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import { useState } from 'react';
import Chatbox from '@/components/chrono-feed/chatbox';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';
import GroupCard from '@/components/chrono-feed/group-card';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

const dummyGroups = [
    { name: 'Next.js Developers', members: '125k members', coverUrl: 'https://placehold.co/400x150.png', coverHint: 'code technology' },
    { name: 'React Community', members: '2.3M members', coverUrl: 'https://placehold.co/400x150.png', coverHint: 'abstract community' },
    { name: 'Design Geeks', members: '50k members', coverUrl: 'https://placehold.co/400x150.png', coverHint: 'design art' },
    { name: 'Food Lovers', members: '780k members', coverUrl: 'https://placehold.co/400x150.png', coverHint: 'food dinner' },
]

export default function GroupsPage() {
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
        <LeftSidebar />
        <main className="flex-1 lg:pl-72 pt-14">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Groups</h1>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dummyGroups.map((group) => (
                    <GroupCard key={group.name} group={group} />
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

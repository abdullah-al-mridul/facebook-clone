
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import { useState } from 'react';
import Chatbox from '@/components/chrono-feed/chatbox';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';
import SavedItem from '@/components/chrono-feed/saved-item';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

const dummySavedItems = [
    { title: '10 Tips for Better Time Management', source: 'ProductivityHub.com', type: 'link', imageUrl: 'https://placehold.co/150x150.png', imageHint: 'clock time' },
    { title: 'React Best Practices 2024', source: 'Posted by Michael Chen', type: 'post', imageUrl: 'https://placehold.co/150x150.png', imageHint: 'code abstract' },
    { title: 'Summer Road Trip Playlist', source: 'Spotify', type: 'music', imageUrl: 'https://placehold.co/150x150.png', imageHint: 'music notes' },
    { title: 'Hiking a Volcano in Iceland', source: 'Epic Travel Videos', type: 'video', imageUrl: 'https://placehold.co/150x150.png', imageHint: 'volcano landscape' },
];

export default function SavedPage() {
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
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Saved Items</h1>
             <div className="bg-card rounded-lg shadow-sm">
                <ul className="divide-y divide-border">
                    {dummySavedItems.map((item) => (
                       <SavedItem key={item.title} item={item} />
                    ))}
                </ul>
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

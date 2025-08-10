
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import { useState } from 'react';
import Chatbox from '@/components/chrono-feed/chatbox';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';
import VideoCard from '@/components/chrono-feed/video-card';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

const dummyVideos = [
    { title: 'How to make the perfect cup of coffee', uploader: 'Coffee Lovers', views: '1.2M views', thumbnailUrl: 'https://placehold.co/400x225.png', thumbnailHint: 'coffee cup' },
    { title: 'A Day in the Life of a Software Engineer', uploader: 'Tech Vlogs', views: '876k views', thumbnailUrl: 'https://placehold.co/400x225.png', thumbnailHint: 'laptop code' },
    { title: '10 Minute Morning Yoga Flow', uploader: 'Yoga with Adrienne', views: '3.1M views', thumbnailUrl: 'https://placehold.co/400x225.png', thumbnailHint: 'yoga person' },
    { title: 'DIY Home Office Makeover', uploader: 'Home Decor Central', views: '543k views', thumbnailUrl: 'https://placehold.co/400x225.png', thumbnailHint: 'office desk' },
];

export default function WatchPage() {
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
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Watch</h1>
            <div className="space-y-6">
                {dummyVideos.map((video) => (
                    <VideoCard key={video.title} video={video} />
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

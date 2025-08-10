
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import NewsFeed from '@/components/chrono-feed/news-feed';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import Chatbox from '@/components/chrono-feed/chatbox';
import { useState } from 'react';
import { User } from '@/types';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

export default function Home() {
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [openChats, setOpenChats] = useState<ChatWindowState[]>([]);

  const handleUserSelect = (user: User) => {
    setIsMessageDrawerOpen(false);

    const existingChat = openChats.find(chat => chat.user.name === user.name);

    if (existingChat) {
      // If chat exists and is minimized, expand it
      if (existingChat.isMinimized) {
        setOpenChats(prevChats =>
          prevChats.map(chat =>
            chat.user.name === user.name ? { ...chat, isMinimized: false } : chat
          )
        );
      }
    } else {
      // If chat doesn't exist, add it
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
      />
       <MessageDrawer 
        isOpen={isMessageDrawerOpen} 
        onOpenChange={setIsMessageDrawerOpen}
        onUserSelect={handleUserSelect}
      />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 lg:pl-72 pt-14">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto">
            <NewsFeed />
          </div>
        </main>
      </div>
      <div className="fixed bottom-0 right-4 flex items-end gap-4">
         {/* Minimized chats on the left of expanded ones */}
        {minimizedChats.map((chat) => (
            <MinimizedChat 
              key={chat.user.name} 
              user={chat.user} 
              onClose={() => closeChat(chat.user.name)}
              onExpand={() => toggleMinimize(chat.user.name)}
              />
        ))}
         {/* Vertical stack of expanded chats */}
        <div className="flex flex-col gap-4">
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
    </div>
  );
}

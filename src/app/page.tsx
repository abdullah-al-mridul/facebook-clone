
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import NewsFeed from '@/components/chrono-feed/news-feed';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import Chatbox from '@/components/chrono-feed/chatbox';
import { useState } from 'react';
import { User } from '@/types';

export default function Home() {
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [openChats, setOpenChats] = useState<User[]>([]);

  const handleUserSelect = (user: User) => {
    setIsMessageDrawerOpen(false);
    if (!openChats.find(chat => chat.name === user.name)) {
      setOpenChats(prevChats => [...prevChats, user]);
    }
  };

  const closeChat = (userName: string) => {
    setOpenChats(prevChats => prevChats.filter(chat => chat.name !== userName));
  };


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
        {openChats.map((user, index) => (
          <Chatbox 
            key={user.name} 
            user={user} 
            onClose={() => closeChat(user.name)} 
          />
        ))}
      </div>
    </div>
  );
}

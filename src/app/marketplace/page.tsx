
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import { useState } from 'react';
import Chatbox from '@/components/chrono-feed/chatbox';
import MinimizedChat from '@/components/chrono-feed/minimized-chat';
import ProductCard from '@/components/chrono-feed/product-card';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

const dummyProducts = [
    { name: 'Vintage Camera', price: '$150', location: 'San Francisco, CA', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'camera vintage' },
    { name: 'Modern Bookshelf', price: '$75', location: 'New York, NY', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'bookshelf furniture' },
    { name: 'Acoustic Guitar', price: '$200', location: 'Austin, TX', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'guitar music' },
    { name: 'House Plant', price: '$25', location: 'Miami, FL', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'plant decor' },
    { name: 'Desk Chair', price: '$100', location: 'Chicago, IL', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'chair office' },
    { name: 'Mountain Bike', price: '$350', location: 'Denver, CO', imageUrl: 'https://placehold.co/300x300.png', imageHint: 'bicycle outdoor' },
];

export default function MarketplacePage() {
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
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {dummyProducts.map((product) => (
                    <ProductCard key={product.name} product={product} />
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

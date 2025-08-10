
'use client';

import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import ProfileHeader from '@/components/chrono-feed/profile-header';
import ProfilePosts from '@/components/chrono-feed/profile-posts';
import { useState } from 'react';
import MessageDrawer from '@/components/chrono-feed/message-drawer';
import NotificationDrawer from '@/components/chrono-feed/notification-drawer';
import { User } from '@/types';
import ProfileAbout from '@/components/chrono-feed/profile-about';

type ChatWindowState = {
  user: User;
  isMinimized: boolean;
};

export default function ProfilePage() {
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [openChats, setOpenChats] = useState<ChatWindowState[]>([]);
  const [activeTab, setActiveTab] = useState('Posts');

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

  const renderContent = () => {
    switch (activeTab) {
      case 'Posts':
        return <ProfilePosts />;
      case 'About':
        return <ProfileAbout />;
      case 'Friends':
        return <div className="text-center py-10">Friends content goes here.</div>;
      case 'Photos':
        return <div className="text-center py-10">Photos content goes here.</div>;
      default:
        return <ProfilePosts />;
    }
  };


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
          <div className="w-full max-w-5xl mx-auto">
            <ProfileHeader activeTab={activeTab} onTabChange={setActiveTab}/>
            <div className="p-4 sm:p-6 lg:p-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

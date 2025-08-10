
import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import ProfileHeader from '@/components/chrono-feed/profile-header';
import ProfilePosts from '@/components/chrono-feed/profile-posts';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMessagesClick={() => {}}
        onNotificationsClick={() => {}}
      />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 lg:pl-72 pt-14">
          <div className="w-full max-w-5xl mx-auto">
            <ProfileHeader />
            <Separator />
            <div className="p-4 sm:p-6 lg:p-8">
              <ProfilePosts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

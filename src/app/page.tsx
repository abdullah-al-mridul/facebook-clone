import Header from '@/components/chrono-feed/header';
import LeftSidebar from '@/components/chrono-feed/left-sidebar';
import NewsFeed from '@/components/chrono-feed/news-feed';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 lg:pl-72 pt-14">
          <div className="p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto">
            <NewsFeed />
          </div>
        </main>
      </div>
    </div>
  );
}

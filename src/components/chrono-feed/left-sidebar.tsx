
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, UserSquare2, Bookmark, Clapperboard, History, Store } from 'lucide-react';

const SidebarLink = ({ href, icon: Icon, text }: { href: string; icon: React.ElementType; text: string }) => (
  <Link href={href} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
    <Icon className="w-7 h-7 text-primary" />
    <span className="font-semibold">{text}</span>
  </Link>
);

export default function LeftSidebar() {
  return (
    <aside className="fixed top-14 left-0 h-screen w-72 p-4 hidden lg:block overflow-y-auto">
      <div className="flex flex-col gap-2">
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="font-semibold">Current User</span>
        </Link>
        <SidebarLink href="/friends" icon={Users} text="Friends" />
        <SidebarLink href="/groups" icon={UserSquare2} text="Groups" />
        <SidebarLink href="/marketplace" icon={Store} text="Marketplace" />
        <SidebarLink href="/watch" icon={Clapperboard} text="Watch" />
        <SidebarLink href="/memories" icon={History} text="Memories" />
        <SidebarLink href="/saved" icon={Bookmark} text="Saved" />
      </div>
    </aside>
  );
}

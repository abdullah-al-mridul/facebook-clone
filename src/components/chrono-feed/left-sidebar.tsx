
'use client';

import Link from '@/components/ui/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, UserSquare2, Bookmark, Clapperboard, History, Store, LayoutDashboard, Shield, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SidebarLink = ({ href, icon: Icon, text, active }: { href: string; icon: React.ElementType; text: string; active: boolean; }) => {
    return (
        <Link href={href} className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", active ? "bg-accent" : "hover:bg-accent")}>
            <Icon className="w-7 h-7 text-primary" />
            <span className="font-semibold">{text}</span>
        </Link>
    );
};

export default function LeftSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="h-full w-full bg-card p-4 overflow-y-auto">
       <div className="flex flex-col gap-2 pt-14 lg:pt-0">
        <Link href="/profile" className={cn("flex items-center gap-3 p-2 rounded-lg transition-colors", isActive('/profile') ? "bg-accent" : "hover:bg-accent")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="font-semibold">Current User</span>
        </Link>
        <SidebarLink href="/friends" icon={Users} text="Friends" active={isActive('/friends')} />
        <SidebarLink href="/messages" icon={MessageCircle} text="Messages" active={isActive('/messages')} />
        <SidebarLink href="/groups" icon={UserSquare2} text="Groups" active={isActive('/groups')} />
        <SidebarLink href="/dashboard" icon={LayoutDashboard} text="Professional Dashboard" active={isActive('/dashboard')} />
        <SidebarLink href="/control-panel" icon={Shield} text="Control Panel" active={isActive('/control-panel')} />
        <SidebarLink href="/marketplace" icon={Store} text="Marketplace" active={isActive('/marketplace')} />
        <SidebarLink href="/watch" icon={Clapperboard} text="Watch" active={isActive('/watch')} />
        <SidebarLink href="/memories" icon={History} text="Memories" active={isActive('/memories')} />
        <SidebarLink href="/saved" icon={Bookmark} text="Saved" active={isActive('/saved')} />
      </div>
    </aside>
  );
}

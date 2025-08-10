
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Home, MessageCircle, Search, Store, Users, Clapperboard, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavLink = ({ href, icon: Icon, active = false }: { href: string, icon: React.ElementType, active?: boolean }) => (
  <Link href={href} className={`px-4 lg:px-8 py-3 relative flex items-center justify-center h-full ${active ? 'text-primary' : 'text-muted-foreground hover:bg-accent'} rounded-lg transition-colors`}>
    <Icon className="w-7 h-7" />
    {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>}
  </Link>
);

type HeaderProps = {
  onMessagesClick: () => void;
  onNotificationsClick: () => void;
};


export default function Header({ onMessagesClick, onNotificationsClick }: HeaderProps) {
  const pathname = usePathname();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Link href="/">
          <span className="text-2xl font-bold text-[#3B5998]">ChronoFeed</span>
        </Link>
        <div className="relative hidden md:block ml-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search ChronoFeed" className="pl-10 bg-background rounded-full w-64" />
        </div>
      </div>
      
      <nav className="absolute left-1/2 -translate-x-1/2 h-full hidden lg:flex items-center">
        <NavLink href="/" icon={Home} active={pathname === '/'} />
        <NavLink href="#" icon={Users} />
        <NavLink href="#" icon={Clapperboard} />
        <NavLink href="#" icon={Store} />
      </nav>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-accent hover:bg-accent/80">
          <Menu />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-accent hover:bg-accent/80" onClick={onMessagesClick}>
          <MessageCircle />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-accent hover:bg-accent/80" onClick={onNotificationsClick}>
          <Bell />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-10 w-10">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

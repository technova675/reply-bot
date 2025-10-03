
"use client";

import Link from 'next/link';
import {
  Home,
  Search,
  Bell,
  Mail,
  List,
  Bookmark,
  Users,
  User,
  MoreHorizontal,
  Briefcase,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile as UserProfileType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const XLogo = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-current">
        <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </g>
    </svg>
);

const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-full h-full"
  >
    <path d="M21.8,4.3C21.3,4,20.7,4,20.2,4.3L3,11.3c-0.6,0.2-1,0.9-1,1.5c0,0.7,0.4,1.3,1,1.5l4.3,1.5l1.5,4.3c0.2,0.6,0.9,1,1.5,1c0.1,0,0.2,0,0.2,0c0.6-0.1,1.2-0.5,1.4-1.2L22,4.9C22.1,4.7,22,4.5,21.8,4.3z M18.5,7.3l-7.2,4.5c-0.1,0.1-0.2,0-0.2-0.1l-0.5-2.2L18.5,7.3z"></path>
  </svg>
);


const NavItem = ({ href, icon: Icon, text, active = false }: { href: string, icon: React.ElementType, text: string, active?: boolean }) => (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
            "flex justify-start items-center gap-4 text-xl w-auto rounded-full px-4 py-3 h-auto",
            active ? 'font-bold' : 'font-normal'
        )}
        aria-label={text}
      >
        <Icon size={26} strokeWidth={active ? 2.5 : 2} />
        <span>{text}</span>
      </Button>
    </Link>
);

const UserProfileSwitcher = ({ users, selectedUser, setSelectedUser }: { users: UserProfileType[], selectedUser: UserProfileType | null, setSelectedUser: (user: UserProfileType) => void}) => {
    
  if (!selectedUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-between w-full hover:bg-muted/50 p-3 rounded-full cursor-pointer transition-colors duration-200 h-auto">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                    <p className="font-bold text-sm flex items-center gap-1">
                      {selectedUser.name}
                      {selectedUser.countryFlag && (
                        <img src={selectedUser.countryFlag} alt="country flag" className="w-4 h-4" />
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">@{selectedUser.handle}</p>
                </div>
            </div>
            <div>
                <MoreHorizontal size={20} className="text-muted-foreground" />
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" side="right">
        <DropdownMenuItem disabled>
          <div className="font-bold">Add an existing account</div>
        </DropdownMenuItem>
        {users.map((user) => (
          <DropdownMenuItem key={user.handle} onSelect={() => setSelectedUser(user)} disabled={selectedUser.handle === user.handle}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm flex items-center gap-1">
                    {user.name}
                    {user.countryFlag && (
                      <img src={user.countryFlag} alt="country flag" className="w-4 h-4" />
                    )}
                  </p>
                  <p className="text-muted-foreground text-sm">@{user.handle}</p>
                </div>
              </div>
              {selectedUser.handle === user.handle && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
         <DropdownMenuItem disabled>
          <div className="font-bold">Log out @{selectedUser.handle}</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default function Sidebar({ users, selectedUser, setSelectedUser, pageTitle }: { users: UserProfileType[], selectedUser: UserProfileType | null, setSelectedUser: (user: UserProfileType) => void, pageTitle: string }) {
  const baseNavItems = [
    { href: '/feed', icon: Home, text: 'Home' },
  ];

  const jobsNavItem = { href: '/jobs', icon: Briefcase, text: 'Jobs' };
  const telejobsNavItem = { href: '/telejobs', icon: TelegramIcon, text: 'Telegram Jobs' };

  const navItems =
    selectedUser?.name.toLowerCase() === 'sim'
      ? [...baseNavItems, jobsNavItem, telejobsNavItem]
      : baseNavItems;


  return (
    <header className="hidden sm:flex flex-col justify-between h-screen p-2 sticky top-0 w-64 items-start">
      <div className="flex flex-col items-start gap-2 w-full">
         <div className="p-3">
           <XLogo />
         </div>
         <nav className="flex flex-col items-start gap-2 w-full">
           {navItems.map((item) => (
             <NavItem 
                key={item.text} 
                {...item} 
                active={pageTitle === item.text} 
             />
            ))}
         </nav>
         {/* <Button className="rounded-full w-full h-auto py-3 text-lg mt-4 bg-primary text-primary-foreground">
          Post
         </Button> */}
      </div>

      <div className="mb-4 w-full">
        {selectedUser && (
           <UserProfileSwitcher users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        )}
      </div>
    </header>
  );
}


"use client";

import Link from 'next/link';
import {
  Home,
  Briefcase,
  Users,
  PanelLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile as UserProfileType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

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

const NavItem = ({ href, icon: Icon, text, active = false, isMobile = false, onClick }: { href: string, icon: React.ElementType, text: string, active?: boolean, isMobile?: boolean, onClick?: () => void }) => (
    <Link href={href} passHref onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
            "flex justify-start items-center gap-4 text-xl w-full rounded-full px-4 py-3 h-auto",
            active ? 'font-bold' : 'font-normal',
            isMobile && 'w-full'
        )}
        aria-label={text}
      >
        <Icon size={26} strokeWidth={active ? 2.5 : 2} />
        <span className={cn(isMobile ? 'block' : 'hidden lg:block')}>{text}</span>
      </Button>
    </Link>
);

const UserProfileDisplay = ({ selectedUser }: { selectedUser: UserProfileType | null }) => {
  if (!selectedUser) return null;

  return (
    <div className="flex items-center justify-between w-full p-3 rounded-full">
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
    </div>
  );
};

export default function Sidebar({ 
    users, 
    selectedUser, 
    setSelectedUser, 
    pageTitle,
    isMobile = false,
    onNavItemClick 
}: { 
    users: UserProfileType[], 
    selectedUser: UserProfileType | null, 
    setSelectedUser: (user: UserProfileType) => void, 
    pageTitle: string,
    isMobile?: boolean,
    onNavItemClick?: () => void
}) {
  const baseNavItems = [
    { href: '/feed', icon: Home, text: 'Home' },
  ];

  const jobsNavItem = { href: '/jobs', icon: Briefcase, text: 'Jobs' };
  const foundersNavItem = { href: '/founders', icon: Users, text: 'Founders' };
  const telejobsNavItem = { href: '/telejobs', icon: TelegramIcon, text: 'Telegram Jobs' };

  const navItems =
    selectedUser?.name.toLowerCase() === 'sim'
      ? [...baseNavItems, jobsNavItem, foundersNavItem, telejobsNavItem]
      : baseNavItems;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-2 items-start w-full">
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
                isMobile={isMobile}
                onClick={onNavItemClick}
             />
            ))}
         </nav>
      </div>

      <div className="mb-4 w-full">
        {selectedUser && (
           <UserProfileDisplay selectedUser={selectedUser} />
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return sidebarContent;
  }

  return (
    <header className="hidden sm:flex flex-col justify-between h-screen p-2 sticky top-0 w-24 lg:w-64 items-start transition-all duration-300">
      {sidebarContent}
    </header>
  );
}

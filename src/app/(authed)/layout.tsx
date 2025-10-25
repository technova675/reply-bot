
'use client';

import Sidebar from '@/components/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { users } from '@/lib/users';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import GlobalHeader from '@/components/global-header';
import TopBar from '@/components/top-bar';


export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { loggedInUser: initialUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthLoading) {
      if (!initialUser) {
        router.replace('/');
      } else {
        setSelectedUser(initialUser);
      }
    }
  }, [isAuthLoading, initialUser, router]);

  const handleUserChange = (user: UserProfile) => {
    setSelectedUser(user);
    sessionStorage.setItem('loggedInUserHandle', user.handle);
    router.push(pathname); 
    router.refresh();
    setIsSheetOpen(false);
  };
  
  const closeMobileSidebar = () => {
    setIsSheetOpen(false);
  };
  
  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/jobs')) return 'Jobs';
    if (pathname.startsWith('/telejobs')) return 'Telegram Jobs';
    if (pathname.startsWith('/founders')) return 'Founders';
    if (pathname.startsWith('/feed')) return 'Home';
    if (pathname.startsWith('/post')) return 'Post';
    return 'Home';
  }, [pathname]);

  if (isAuthLoading || !selectedUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Authenticating...</p>
      </div>
    );
  }

  const MobileSidebar = (
    <TooltipProvider>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <Tooltip>
              <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                      <Button size="icon" variant="ghost" className="sm:hidden" onClick={() => setIsSheetOpen(true)}>
                          <PanelLeft />
                          <span className="sr-only">Toggle Menu</span>
                      </Button>
                  </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                  <p>Toggle Menu</p>
              </TooltipContent>
          </Tooltip>
          <SheetContent side="left" className="p-0 w-[300px] sm:w-[320px]">
             <Sidebar 
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={handleUserChange}
                pageTitle={pageTitle}
                isMobile={true}
                onNavItemClick={closeMobileSidebar}
              />
          </SheetContent>
      </Sheet>
    </TooltipProvider>
  );

  const needsTopBar = !pathname.startsWith('/post');
  const needsTelejobsTopBar = pathname.startsWith('/telejobs');

  return (
    <>
      <GlobalHeader />
      <div className="bg-background text-foreground">
        <div className="flex min-h-screen">
          <Sidebar 
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={handleUserChange}
            pageTitle={pageTitle}
          />
          <main className="flex-1 sm:border-x border-border flex flex-col">
            {needsTelejobsTopBar && <TopBar pageTitle="Telegram Jobs" mobileSidebar={MobileSidebar} />}
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

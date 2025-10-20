
'use client';

import Sidebar from '@/components/sidebar';
import TopBar from '@/components/top-bar';
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
import type { JobFilterType } from './jobs/page';
import FounderFilters from '@/components/founder-filters';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { FounderFilterType } from './founders/page';


export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { loggedInUser: initialUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // State for filters, managed at the layout level
  const [activeFeedFilter, setFeedActiveFilter] = useState('All');
  const [activeJobFilter, setJobActiveFilter] = useState<JobFilterType>('All');
  const [activeFounderFilter, setFounderActiveFilter] = useState<FounderFilterType>('All');


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

  const renderTopBar = () => {
    const baseProps = {
      pageTitle,
      mobileSidebar: MobileSidebar
    };

    if (pathname.startsWith('/feed')) {
      return (
        <TopBar
          {...baseProps}
          activeFilter={activeFeedFilter}
          onFilterChange={(filter) => setFeedActiveFilter(filter)}
          showFilters={true}
        />
      );
    }

    if (pathname.startsWith('/jobs')) {
      return (
        <TopBar
          {...baseProps}
          activeFilter={activeJobFilter}
          onFilterChange={(filter) => setJobActiveFilter(filter as JobFilterType)}
          showFilters={true}
          filterTabs={[
            { value: 'All', label: 'All' },
            { value: 'DM Done', label: 'DM Done' },
            { value: 'Yet To DM', label: 'Yet To DM' },
          ]}
        />
      );
    }

    if (pathname.startsWith('/founders')) {
      return (
        <TopBar {...baseProps}>
          <FounderFilters
            activeFilter={activeFounderFilter}
            onFilterChange={(filter) => setFounderActiveFilter(filter as FounderFilterType)}
            filterTabs={[
              { value: 'All', label: 'All' },
              { value: 'To DM', label: 'To DM' },
              { value: 'DM Sent', label: 'DM Sent' },
            ]}
          />
        </TopBar>
      );
    }

    // Default TopBar for other pages like /telejobs
    if (!pathname.startsWith('/post')) {
      return <TopBar {...baseProps} />;
    }

    return null; // No TopBar on /post/[id] page
  };

  // By passing the filter state down to the children, we allow the pages to use it.
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      if (pathname.startsWith('/feed')) {
        return React.cloneElement(child, { activeFilter: activeFeedFilter } as any);
      }
      if (pathname.startsWith('/jobs')) {
        return React.cloneElement(child, { activeFilter: activeJobFilter } as any);
      }
    }
    return child;
  });


  return (
    <div className="bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={handleUserChange}
          pageTitle={pageTitle}
        />
        <main className="flex-1 sm:border-x border-border">
          {renderTopBar()}
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}

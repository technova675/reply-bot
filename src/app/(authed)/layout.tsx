
'use client';

import Sidebar from '@/components/sidebar';
import TopBar from '@/components/top-bar';
import { useAuth } from '@/hooks/use-auth';
import { users } from '@/lib/users';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  const { loggedInUser: initialUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

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
    // Reload the page to reflect user change
    // This is a simple way to ensure data consistency for now.
    router.push(pathname); 
    router.refresh();
  };
  
  if (isAuthLoading || !selectedUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Authenticating...</p>
      </div>
    );
  }

  const getPageTitle = (path: string) => {
    if (path.startsWith('/jobs')) return 'Jobs';
    if (path.startsWith('/telejobs')) return 'Telegram Jobs';
    if (path.startsWith('/feed')) return 'Home';
    if (path.startsWith('/post')) return 'Post';
    return 'Home';
  }

  const pageTitle = getPageTitle(pathname);

  // Certain pages have their own TopBar implementation to handle complex state like filtering
  const showGenericTopBar = !pathname.startsWith('/post') && !pathname.startsWith('/feed') && !pathname.startsWith('/jobs');

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar 
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={handleUserChange}
          pageTitle={pageTitle}
        />
        <main className="flex-1 border-x border-border">
          {showGenericTopBar && <TopBar pageTitle={pageTitle} />}
          {children}
        </main>
      </div>
    </div>
  );
}

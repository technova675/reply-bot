
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { loggedInUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (loggedInUser) {
        router.replace('/feed');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, loggedInUser, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Loader2 className="animate-spin text-muted-foreground" size={24} />
      <p className="ml-2">Loading...</p>
    </div>
  );
}


'use client';

import GlobalHeader from '@/components/global-header';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loggedInUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !loggedInUser) {
      router.replace('/');
    }
  }, [isLoading, loggedInUser, router]);

  if (isLoading || !loggedInUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <GlobalHeader />
      {children}
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { users } from '@/lib/users';
import type { UserProfile } from '@/lib/types';

export function useAuth() {
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userHandle = sessionStorage.getItem('loggedInUserHandle');
    if (userHandle) {
      const user = users.find(u => u.handle === userHandle);
      setLoggedInUser(user || null);
    }
    setIsLoading(false);
  }, []);

  return { loggedInUser, isLoading };
}

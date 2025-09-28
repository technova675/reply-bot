
'use client';

import { useRouter } from 'next/navigation';
import { users } from '@/lib/users';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import GlobalHeader from '@/components/global-header';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (user: UserProfile) => {
    sessionStorage.setItem('loggedInUserHandle', user.handle);
    router.push('/feed');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalHeader />
      <main className="container mx-auto flex flex-col items-center justify-center pt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline mb-2">Welcome to ChirpFeed</h1>
          <p className="text-lg text-muted-foreground">Select an account to continue</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
          {users.map((user) => (
            <Card
              key={user.handle}
              onClick={() => handleLogin(user)}
              className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                <Avatar className="w-24 h-24 border-4 border-background ring-2 ring-primary">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-bold text-xl flex items-center gap-2">
                    {user.name}
                    {user.countryFlag && (
                      <img src={user.countryFlag} alt="country flag" className="w-5 h-5" />
                    )}
                  </p>
                  <p className="text-muted-foreground">@{user.handle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}


'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { UserProfile as UserProfileType } from '@/lib/types';
import { getUserProfile } from '@/lib/data';

type TopBarProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

const UserProfile = () => {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const fetchedUser = await getUserProfile();
      setUser(fetchedUser);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-3 h-[68px]">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-between w-full hover:bg-muted/50 p-3 rounded-full cursor-pointer transition-colors duration-200">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="hidden xl:block">
                    <p className="font-bold text-sm">Anonymous</p>
                    <p className="text-muted-foreground text-sm">@user</p>
                </div>
            </div>
            <div className="hidden xl:block">
                <MoreHorizontal size={20} className="text-muted-foreground" />
            </div>
        </div>
    );
  }

  return (
      <div className="flex items-center justify-between w-full hover:bg-muted/50 p-3 rounded-full cursor-pointer transition-colors duration-200">
          <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden xl:block">
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-muted-foreground text-sm">@{user.handle}</p>
              </div>
          </div>
          <div className="hidden xl:block">
              <MoreHorizontal size={20} className="text-muted-foreground" />
          </div>
      </div>
  );
};


export default function TopBar({ filter, setFilter }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-col p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-headline">Home</h1>
        <div className="hidden sm:block">
          <UserProfile />
        </div>
      </div>
      <RadioGroup
        value={filter}
        onValueChange={setFilter}
        className="flex items-center space-x-4 mt-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="r1" />
          <Label htmlFor="r1">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="replied" id="r2" />
          <Label htmlFor="r2">Replied</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="not-replied" id="r3" />
          <Label htmlFor="r3">Not Replied</Label>
        </div>
      </RadioGroup>
      
    </header>
  );
}

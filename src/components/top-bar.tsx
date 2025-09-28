
'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Check } from 'lucide-react';
import type { UserProfile as UserProfileType } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { useRouter } from "next/navigation";

type TopBarProps = {
  filter: string;
  setFilter: (filter: string) => void;
  users: UserProfileType[];
  selectedUser: UserProfileType;
  setSelectedUser: (user: UserProfileType) => void;
};

const UserProfileSwitcher = ({ users, selectedUser, setSelectedUser }: Omit<TopBarProps, 'filter' | 'setFilter'>) => {
  const router = useRouter();

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
      <DropdownMenuContent className="w-64" align="end">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default function TopBar({ filter, setFilter, users, selectedUser, setSelectedUser }: TopBarProps) {

  return (
    <header className="sticky top-0 z-10 flex flex-col p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold font-headline">Home</h1>
        </div>
        <div className="hidden sm:block">
          <UserProfileSwitcher users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <RadioGroup
          value={filter}
          onValueChange={setFilter}
          className="flex items-center space-x-4"
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
      </div>
      
    </header>
  );
}


'use client';

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
  pageTitle: string;
};

export default function TopBar({ pageTitle }: TopBarProps) {

  return (
    <header className="sticky top-0 z-10 flex flex-col p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold font-headline">{pageTitle}</h1>
        </div>
      </div>
    </header>
  );
}

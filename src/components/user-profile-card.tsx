
'use client';

import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck, CalendarDays, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { format } from 'date-fns';
import type { JobUserData } from '@/lib/types';

type UserProfileCardProps = {
  user: JobUserData;
};

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const {
    name,
    url,
    profilePicture,
    coverPicture,
    isBlueVerified,
    description,
    followers,
    following,
    createdAt,
    display_url
  } = user;

  const userName = url.split('/').pop() || '';
  const joinedDate = createdAt ? format(new Date(createdAt), 'MMMM yyyy') : '';

  return (
    <div className="bg-card text-foreground rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-24 bg-muted">
        {coverPicture && (
          <Image
            src={coverPicture}
            alt={`${name}'s cover photo`}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start -mt-14">
          <Avatar className="w-20 h-20 border-4 border-card ring-2 ring-background">
            <AvatarImage src={profilePicture} alt={`${name}'s avatar`} />
            <AvatarFallback>{name ? name.charAt(0) : ''}</AvatarFallback>
          </Avatar>
          {/* <div className="flex gap-2 pt-14">
             <Button variant="ghost" size="icon" className="rounded-full border border-border">
                <MoreHorizontal size={20} />
            </Button>
            <Button className="rounded-full font-bold">Follow</Button>
          </div> */}
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-bold">{name}</h2>
            {isBlueVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
          </div>
          <p className="text-muted-foreground">@{userName}</p>
        </div>

        <p className="mt-3 text-sm">{description}</p>
        
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {display_url && (
                 <a href={`https://${display_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-primary">
                    <LinkIcon size={14} />
                    <span>{display_url}</span>
                </a>
            )}
            {joinedDate && (
                <div className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    <span>Joined {joinedDate}</span>
                </div>
            )}
        </div>


        <div className="mt-3 flex gap-4 text-sm">
          <p>
            <span className="font-bold text-foreground">{formatNumber(following)}</span>
            <span className="text-muted-foreground"> Following</span>
          </p>
          <p>
            <span className="font-bold text-foreground">{formatNumber(followers)}</span>
            <span className="text-muted-foreground"> Followers</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;

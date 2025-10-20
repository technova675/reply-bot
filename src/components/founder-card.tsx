
'use client';

import type { Founder } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type FounderCardProps = {
  founder: Founder;
};

const FounderCard = ({ founder }: FounderCardProps) => {
  const { name, url, profilePicture, description, isBlueVerified, canDm, dm_status } = founder;
  const handle = url.split('/').pop() || '';

  // Function to parse the bio and turn @mentions and links into clickable links
  const renderBio = (text: string) => {
    const parts = text.split(/([@#$]\w+|https?:\/\/\S+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <Link key={index} href={`https://x.com/${part.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {part}
          </Link>
        );
      }
      if (part.startsWith('http')) {
        return (
          <Link key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {part}
          </Link>
        );
      }
      if (part.match(/([#$]\w+)/)) {
        return <span key={index} className="text-primary">{part}</span>
      }
      return part;
    });
  };

  return (
    <article className="flex p-4 border-b border-border hover:bg-muted/50 transition-colors duration-200">
      <div className="flex-shrink-0 mr-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profilePicture} alt={`${name}'s avatar`} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-base hover:underline">{name}</h3>
              {isBlueVerified && <BadgeCheck className="w-5 h-5 text-primary" />}
            </div>
            <p className="text-muted-foreground text-sm">@{handle}</p>
          </div>
           {canDm && (
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "rounded-full font-bold px-4",
                dm_status && "bg-green-500/10 text-green-500 border-green-500/20"
              )}
              disabled={dm_status}
            >
              {dm_status ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  DM Sent
                </>
              ) : "DM"}
            </Button>
          )}
        </div>
        <div className="mt-1 text-base whitespace-pre-wrap">
          {renderBio(description)}
        </div>
      </div>
    </article>
  );
};

export default FounderCard;

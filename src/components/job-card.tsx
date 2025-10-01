
'use client';

import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2 } from 'lucide-react';
import type { Job } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, formatNumber } from '@/lib/utils';
import MediaGrid from './media-grid';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const {
    authorName,
    authorUserName,
    authorProfilePicture,
    authorIsBlueVerified,
    text,
    images,
    replyCount,
    retweetCount,
    likeCount,
    bookmarkCount,
    applied_status,
  } = job;

  const actionItems = [
    { icon: MessageCircle, value: replyCount, color: 'hover:text-primary' },
    { icon: Repeat2, value: retweetCount, color: 'hover:text-green-500' },
    { icon: Heart, value: likeCount, color: 'hover:text-red-500' },
    { icon: Bookmark, value: bookmarkCount, color: 'hover:text-primary' },
  ];

  let imageUrls: string[] = [];
  if (typeof images === 'string' && images.trim() !== '') {
    imageUrls = images.split(',').map(url => url.trim()).filter(url => url.length > 0);
  }

  return (
    <article className="flex flex-col p-4 border-b border-border">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
          <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold hover:underline">{authorName}</span>
              {authorIsBlueVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
              <span className="text-muted-foreground ml-1">@{authorUserName}</span>
            </div>
             <Button variant="ghost" size="icon" className="text-muted-foreground -mt-2">
                <MoreHorizontal size={20} />
            </Button>
          </div>

          <p className="text-base whitespace-pre-wrap">{text}</p>

          {imageUrls.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border">
              <MediaGrid images={imageUrls} />
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-8 text-muted-foreground">
                {actionItems.map((item, index) => (
                    <div key={index} className={`flex items-center gap-2 text-sm transition-colors duration-200 ${item.color}`}>
                        <item.icon size={18} />
                        {item.value > 0 && <span>{formatNumber(item.value)}</span>}
                    </div>
                ))}
            </div>
            <Button 
              size="sm" 
              className={cn(
                'rounded-full font-bold px-5',
                applied_status === 'APPLIED' && 'bg-green-500 hover:bg-green-600'
              )}
              disabled={applied_status === 'APPLIED'}
            >
              {applied_status === 'APPLIED' ? 'Applied' : 'Apply'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

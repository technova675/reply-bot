
'use client';

import { useState, useEffect } from 'react';
import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, BarChart2 } from 'lucide-react';
import type { Job } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, formatNumber } from '@/lib/utils';
import MediaGrid from './media-grid';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Separator } from './ui/separator';

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
    viewCount,
    applied_status,
    canDm,
    createdAt,
  } = job;

  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (createdAt) {
      try {
        const date = new Date(createdAt);
        const absoluteTime = format(date, "h:mm a '·' MMM d, yyyy");
        const relativeTime = formatDistanceToNowStrict(date, { addSuffix: true });
        setFormattedTime(`${absoluteTime} (${relativeTime})`);
      } catch (error) {
        console.error("Error formatting date:", error);
        // Fallback for potentially invalid date string
        const simpleDate = createdAt.split(' ').slice(0, 4).join(' ');
        setFormattedTime(simpleDate);
      }
    }
  }, [createdAt]);

  const actionItems = [
    { icon: MessageCircle, value: replyCount, color: 'hover:text-primary' },
    { icon: Repeat2, value: retweetCount, color: 'hover:text-green-500' },
    { icon: Heart, value: likeCount, color: 'hover:text-red-500' },
    { icon: Bookmark, value: bookmarkCount, color: 'hover:text-primary' },
    { icon: BarChart2, value: viewCount, color: 'hover:text-primary' },
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
            <div className="flex items-center flex-wrap gap-1 text-sm">
              <span className="font-bold hover:underline">{authorName}</span>
              {authorIsBlueVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
              <span className="text-muted-foreground ml-1">@{authorUserName}</span>
            </div>
             <Button variant="ghost" size="icon" className="text-muted-foreground -mt-2">
                <MoreHorizontal size={20} />
            </Button>
          </div>

          <p className="text-base whitespace-pre-wrap mb-3">{text}</p>

          {imageUrls.length > 0 && (
            <div className="mt-3 mb-3 overflow-hidden rounded-2xl border border-border">
              <MediaGrid images={imageUrls} />
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-8 text-muted-foreground">
                {actionItems.map((item, index) => (
                    <div key={index} className={`flex items-center gap-2 text-sm transition-colors duration-200 ${item.color}`}>
                        <item.icon size={18} />
                        {item.value > 0 && <span>{formatNumber(item.value)}</span>}
                    </div>
                ))}
                 {formattedTime && (
            <div className="text-sm text-muted-foreground my-3">
                <span>{formattedTime}</span>
            </div>
          )}
            </div>
            {canDm && (
              <Button 
                size="sm" 
                className={cn(
                  'rounded-full font-bold px-5',
                  applied_status === 'APPLIED' && 'bg-green-500 hover:bg-green-600'
                )}
                disabled={applied_status === 'APPLIED'}
              >
                {applied_status === 'APPLIED' ? 'Applied' : 'DM'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

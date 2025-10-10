

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, BarChart2 } from 'lucide-react';
import type { Job } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, formatNumber } from '@/lib/utils';
import { format, formatDistanceToNowStrict } from 'date-fns';

type JobCardProps = {
  job: Job;
};

const JobPreviewCard = ({ job }: { job: Job }) => {
  if (!job.card_found || !job.card_image) {
    return null;
  }

  return (
    <a href={job.card_url} target="_blank" rel="noopener noreferrer" className="block mt-3 mb-3 overflow-hidden rounded-2xl border border-border hover:opacity-90 transition-opacity">
      <div className="relative w-full aspect-[1.91/1]">
        <Image
          src={job.card_image}
          alt={job.card_title || 'Job preview'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <div className="bg-black/50 backdrop-blur-sm rounded-md p-2">
            <h3 className="text-sm font-semibold text-white truncate">{job.card_title}</h3>
            <p className="text-xs text-gray-300 truncate">{job.card_domain}</p>
          </div>
        </div>
      </div>
    </a>
  );
};


export default function JobCard({ job }: JobCardProps) {
  const {
    authorName,
    authorUserName,
    authorProfilePicture,
    authorIsBlueVerified,
    text,
    replyCount,
    retweetCount,
    likeCount,
    bookmarkCount,
    viewCount,
    applied_status,
    canDm,
    createdAt,
  } = job;

  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (createdAt) {
      try {
        const date = new Date(createdAt);
        setTimeAgo(formatDistanceToNowStrict(date, { addSuffix: true }));
      } catch (error) {
        console.error("Error formatting date:", error);
        const simpleDate = createdAt.split(' ').slice(0, 4).join(' ');
        setTimeAgo(simpleDate);
      }
    }
  }, [createdAt]);

  const actionItems = [
    { icon: MessageCircle, value: replyCount, color: 'hover:text-primary' },
    { icon: Repeat2, value: retweetCount, color: 'hover:text-green-500' },
    { icon: Heart, value: likeCount, color: 'hover:text-red-500' },
    { icon: BarChart2, value: viewCount, color: 'hover:text-primary' },
    { icon: Bookmark, value: bookmarkCount, color: 'hover:text-primary' },
  ];

  return (
    <article className="flex flex-col p-4 border-b border-border">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
          <AvatarFallback>{authorName ? authorName.charAt(0) : '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center flex-wrap gap-1 text-sm">
              <span className="font-bold hover:underline">{authorName}</span>
              {authorIsBlueVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
              <span className="text-muted-foreground ml-1">@{authorUserName}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground hover:underline">{timeAgo}</span>
            </div>
             <Button variant="ghost" size="icon" className="text-muted-foreground -mt-2">
                <MoreHorizontal size={20} />
            </Button>
          </div>

          <p className="text-base whitespace-pre-wrap mb-3">{text}</p>
          
          <JobPreviewCard job={job} />

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-8 text-muted-foreground">
                {actionItems.map((item, index) => (
                    <div key={index} className={`flex items-center gap-2 text-sm transition-colors duration-200 ${item.color}`}>
                        <item.icon size={18} />
                        {item.value > 0 && <span>{formatNumber(item.value)}</span>}
                    </div>
                ))}
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

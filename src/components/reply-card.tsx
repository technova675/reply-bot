
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, ExternalLink } from 'lucide-react';
import type { Reply } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatNumber } from '@/lib/utils';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import MediaGrid from './media-grid';

type ReplyCardProps = {
  reply: Reply;
};

export default function ReplyCard({ reply }: ReplyCardProps) {
  const { authorName, authorUserName, authorProfilePicture, text, media, replyCount, likeCount, viewCount, createdAt, url } = reply;
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (createdAt) {
      setTimeAgo(formatDistanceToNow(new Date(createdAt), { addSuffix: true }));
    }
  }, [createdAt]);
  
  const isLongText = text.length > 150;
  const shouldClamp = isLongText && !isExpanded;
  
  const actionItems = [
    { icon: MessageCircle, value: replyCount, color: 'hover:text-primary' },
    { icon: Repeat2, value: 0, color: 'hover:text-green-500' }, // retweetCount is not in the new object
    { icon: Heart, value: likeCount, color: 'hover:text-red-500' },
    { icon: BarChart2, value: viewCount, color: 'hovertext-primary' },
  ];
  
  let imageUrls: string[] = [];
  if (typeof media === 'string' && media.trim() !== '') {
    if (media.startsWith('[') && media.endsWith(']')) {
      try {
        const parsed = JSON.parse(media);
        if (Array.isArray(parsed)) {
          imageUrls = parsed;
        }
      } catch (e) {
        console.error("Failed to parse media JSON string in ReplyCard:", e);
      }
    } else {
      // Handle comma-separated strings
      imageUrls = media.split(',').map(url => url.trim()).filter(url => url.length > 0);
    }
  }

  return (
      <article className="flex flex-col px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors duration-200">
        <div className="flex gap-3">
          <div className="flex flex-col items-center w-10">
            <Avatar className="w-10 h-10">
              <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold hover:underline">{authorName}</span>
              <span className="text-muted-foreground">@{authorUserName}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground hover:underline">{timeAgo}</span>
            </div>
            
            <p className={cn("text-base whitespace-pre-wrap", { "line-clamp-3": shouldClamp })}>
              {text}
            </p>
            {isLongText && (
                 <Button variant="link" size="sm" className="px-0 h-auto text-primary" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Show less' : 'Show more'}
                </Button>
            )}

            {imageUrls.length > 0 && (
                <div className="mt-2 rounded-xl overflow-hidden border border-border">
                    <MediaGrid images={imageUrls} />
                </div>
            )}

            <div className="flex justify-between items-center mt-3 max-w-xs text-muted-foreground">
              {actionItems.map((item, index) => (
                <div key={index} className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${item.color}`}>
                  <item.icon size={16} strokeWidth={1.75}/>
                  {item.value !== null && Number(item.value) > 0 && <span>{formatNumber(Number(item.value))}</span>}
                </div>
              ))}
               <Link href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors duration-200 hover:text-primary">
                  <ExternalLink size={16} strokeWidth={1.75} />
               </Link>
            </div>
          </div>
        </div>
      </article>
  );
}

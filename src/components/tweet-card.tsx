
import Image from 'next/image';
import { MessageCircle, Repeat2, Heart, Upload, Bookmark, BadgeCheck } from 'lucide-react';
import type { Tweet } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatNumber } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import QuoteCard from './quote-card';
import MediaGrid from './media-grid';
import { differenceInSeconds, format as formatDate } from 'date-fns';

type TweetCardProps = {
  tweet: Tweet & { quoteData?: Tweet[] };
  isLCP?: boolean;
  className?: string;
};

const TweetCard = React.forwardRef<HTMLDivElement, TweetCardProps>(
  ({ tweet, isLCP = false, className }, ref) => {
    const { authorName, authorUserName, authorProfilePicture, authorIsBlueVerified, text, fullText,  images, replyCount, retweetCount, likeCount, bookmarkCount, isReply, isReplyToUsername, quoteData, VideoPresent, VideoUrl, createdAt } = tweet;

    const [timeAgo, setTimeAgo] = useState('');
    const [formattedCreatedAt, setFormattedCreatedAt] = useState('');

    useEffect(() => {
      const calculateTimeAgo = () => {
        if (!createdAt) return;
        try {
          const tweetDate = new Date(createdAt);
          const now = new Date();
          const diffInSeconds = differenceInSeconds(now, tweetDate);

          if (diffInSeconds < 5) {
            setTimeAgo("now");
          } else if (diffInSeconds < 60) {
            setTimeAgo(`${diffInSeconds}s ago`);
          } else {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) {
              setTimeAgo(`${diffInMinutes}min ago`);
            } else {
              const hours = Math.floor(diffInMinutes / 60);
              const minutes = diffInMinutes % 60;
              if (minutes === 0) {
                setTimeAgo(`${hours}h ago`);
              } else {
                setTimeAgo(`${hours}h ${minutes}min ago`);
              }
            }
          }
        } catch (error) {
          console.error("Error formatting date:", error);
          const simpleDate = createdAt.split(' ').slice(1, 3).join(' ');
          setTimeAgo(simpleDate);
        }
      };

      const formatTimestamp = () => {
        if (!createdAt) return;
        try {
            const date = new Date(createdAt);
            setFormattedCreatedAt(formatDate(date, "h:mm a, MMM d, yyyy"));
        } catch (error) {
            console.error("Error formatting full timestamp:", error);
            setFormattedCreatedAt(createdAt);
        }
      };
      
      calculateTimeAgo();
      formatTimestamp();
      const interval = setInterval(calculateTimeAgo, 1000); // Update every second

      return () => clearInterval(interval);
    }, [createdAt]);

    const actionItems = [
      { icon: MessageCircle, value: replyCount, color: 'hover:text-primary' },
      { icon: Repeat2, value: retweetCount, color: 'hover:text-green-500' },
      { icon: Heart, value: likeCount, color: 'hover:text-red-500' },
      { icon: Bookmark, value: bookmarkCount, color: 'hover:text-primary' },
    ];
    
    let imageUrls: string[] = [];
    if (typeof images === 'string' && images.trim() !== '') {
      if (images.startsWith('[') && images.endsWith(']')) {
        try {
          const parsed = JSON.parse(images);
          if (Array.isArray(parsed)) {
              imageUrls = parsed;
          }
        } catch (e) {
          console.error("Failed to parse images JSON string in TweetCard:", e);
        }
      } else {
        // Handle comma-separated strings
        imageUrls = images.split(',').map(url => url.trim()).filter(url => url.length > 0);
      }
    }


    return (
        <article ref={ref} className={cn("flex flex-col p-4 border-b border-border hover:bg-muted/50 transition-colors duration-200 cursor-pointer", className)}>
          <div className="flex gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
              <AvatarFallback>{authorName ? authorName.charAt(0) : ''}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold hover:underline">{authorName}</span>
                {authorIsBlueVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                <span className="text-muted-foreground ml-1">@{authorUserName}</span>
              </div>
              
              {isReply && isReplyToUsername && (
                <p className="text-sm text-muted-foreground">
                  Replying to <span className="text-primary">@{isReplyToUsername}</span>
                </p>
              )}

              <div className="space-y-3">
                {fullText ? <p className="text-base whitespace-pre-wrap">{fullText}</p> : <p className="text-base whitespace-pre-wrap">{text}</p>}
                
                {VideoPresent && VideoUrl && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                    <video
                      src={VideoUrl}
                      controls
                      className="w-full h-auto"
                      preload="metadata"
                    />
                  </div>
                )}

                {!VideoPresent && imageUrls.length > 0 && (
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <MediaGrid images={imageUrls} isLCP={isLCP} />
                  </div>
                )}

                {quoteData && quoteData.length > 0 && (
                  <div className="mt-3">
                    <QuoteCard quote={quoteData[0]} />
                  </div>
                )}
              </div>

              {timeAgo && formattedCreatedAt && (
                <p className="text-base text-muted-foreground mt-7 mb-3">
                  {timeAgo} ({formattedCreatedAt})
                </p>
              )}
              
              <div className="flex justify-between items-center mt-4 max-w-md text-muted-foreground">
                {actionItems.map((item, index) => (
                  <div key={index} className={`flex items-center gap-2 text-sm transition-colors duration-200 ${item.color}`}>
                    <item.icon size={18} />
                    {item.value !== null && item.value > 0 && <span>{formatNumber(item.value)}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
    );
  }
);
TweetCard.displayName = "TweetCard";

export default TweetCard;

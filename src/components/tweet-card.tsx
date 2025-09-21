
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Repeat2, Heart, Upload, Bookmark } from 'lucide-react';
import type { Media, Tweet } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatNumber } from '@/lib/utils';

type TweetCardProps = {
  tweet: Tweet;
  isLCP?: boolean;
};

function MediaGrid({ media, isLCP }: { media: string[], isLCP?: boolean }) {
  if (!media || media.length === 0) return null;

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 grid-rows-2',
    4: 'grid-cols-2 grid-rows-2',
  }[media.length] || 'grid-cols-1';

  return (
    <div
      className={cn(
        "mt-3 grid gap-1 rounded-2xl overflow-hidden border border-border",
        gridClasses
      )}
    >
      {media.map((item, index) => {
        const isLaidOut = media.length === 3 && index === 0;
        const imageUrl = item;
        
        return (
          <div
            key={index}
            className={cn("relative aspect-video", { "row-span-2": isLaidOut })}
          >
            <Image
              src={imageUrl}
              alt={`Tweet media ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={isLCP && index === 0} // Apply priority to the first image of the first tweet
            />
          </div>
        );
      })}
    </div>
  );
}

export default function TweetCard({ tweet, isLCP = false }: TweetCardProps) {
  const { authorName, authorUserName, authorProfilePicture, text, fullText,  media, replyCount, retweetCount, likeCount, bookmarkCount } = tweet;

  let parsedMedia: string[] = [];
  try {
    if (typeof media === 'string') {
      parsedMedia = JSON.parse(media);
    } else if (Array.isArray(media)) {
       const shapedMedia = media as any[];
       if (shapedMedia.every(item => typeof item === 'string')) {
           parsedMedia = shapedMedia;
       } else if (shapedMedia.every(item => typeof item.media_url_https === 'string')) {
           parsedMedia = shapedMedia.map(item => item.media_url_https);
       }
    }
  } catch (error) {
    console.error("Failed to parse media JSON string:", error);
  }

  const actionItems = [
    { icon: MessageCircle, value: replyCount, color: 'hover:text-primary' },
    { icon: Repeat2, value: retweetCount, color: 'hover:text-green-500' },
    { icon: Heart, value: likeCount, color: 'hover:text-red-500' },
    { icon: Bookmark, value: bookmarkCount, color: 'hover:text-primary' },
  ];
  
  return (
    <Link href={`/post/${tweet.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
      <article className="flex flex-col p-4 border-b border-border hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
            <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold hover:underline">{authorName}</span>
            </div>
             <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">@{authorUserName}</span>
            </div>
            {fullText ? <p className="text-base whitespace-pre-wrap">{fullText}</p> : <p className="text-base whitespace-pre-wrap">{text}</p>}
            <MediaGrid media={parsedMedia} isLCP={isLCP} />
           
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
    </Link>
  );
}

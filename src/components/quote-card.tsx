
'use client';

import type { Tweet } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeCheck } from 'lucide-react';
import MediaGrid from './media-grid';

type QuoteCardProps = {
  quote: any; // Using 'any' to accommodate the new structure
};

export default function QuoteCard({ quote }: QuoteCardProps) {
  // Using new property names from the updated JSON structure
  const { 
    quoteAuthorName: authorName, 
    quoteAuthorUserName: authorUserName, 
    quoteAuthorProfilePicture: authorProfilePicture, 
    quoteAuthorIsBlueVerified: authorIsBlueVerified, 
    text,
    images
  } = quote;

  let imageUrls: string[] = [];
  if (typeof images === 'string' && images.trim() !== '') {
    if (images.startsWith('[') && images.endsWith(']')) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
            imageUrls = parsed;
        }
      } catch (e) {
        console.error("Failed to parse images JSON string in QuoteCard:", e);
      }
    } else {
      // Handle comma-separated strings
      imageUrls = images.split(',').map(url => url.trim()).filter(url => url.length > 0);
    }
  }

  return (
    <div className="border border-border rounded-2xl p-3 hover:bg-muted/50 transition-colors duration-200">
      <div className="flex items-center gap-2 text-sm mb-2">
        <Avatar className="w-5 h-5">
          <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
          <AvatarFallback>{authorName ? authorName.charAt(0) : ''}</AvatarFallback>
        </Avatar>
        <span className="font-bold">{authorName}</span>
        {authorIsBlueVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
        <span className="text-muted-foreground">@{authorUserName}</span>
      </div>
      <div className='space-y-3'>
        <p className="text-base whitespace-pre-wrap">
          {text}
        </p>

        {imageUrls.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
            <MediaGrid images={imageUrls} />
          </div>
        )}
      </div>
    </div>
  );
}

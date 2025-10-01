
'use client'

import { getTweetRepliesById } from '@/lib/data';
import type { Tweet, Reply } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumber, TweetTime } from '@/lib/utils';
import { MessageCircle, Repeat2, Heart, Upload, ArrowLeft, Bookmark } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ReplyCard from '@/components/reply-card';
import ReplySuggestions from '@/components/reply-suggestions';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import QuoteCard from '@/components/quote-card';
import MediaGrid from '@/components/media-grid';
import { useAuth } from '@/hooks/use-auth';

export default function PostPage() {
    const params = useParams();
    const id = params.id as string;
    const { loggedInUser } = useAuth();
    const [tweet, setTweet] = useState<Tweet | null | undefined>(undefined);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(true);
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        const fetchTweetAndReplies = async () => {
            // Step 1: Get tweet data from sessionStorage
            const cachedTweetJSON = sessionStorage.getItem(`tweet:${id}`);
            if (cachedTweetJSON) {
                const cachedTweet = JSON.parse(cachedTweetJSON);
                setTweet(cachedTweet);
                if (cachedTweet.createdAt) {
                    setFormattedTime(TweetTime(cachedTweet.createdAt));
                }
                // Now that we have the tweet, fetch its replies
                try {
                    setIsLoadingReplies(true);
                    const fetchedReplies = await getTweetRepliesById(id, loggedInUser?.name);
                    setReplies(fetchedReplies || []);
                } catch (error) {
                    console.error("Failed to fetch replies:", error);
                    setReplies([]);
                } finally {
                    setIsLoadingReplies(false);
                }
            } else {
                // If no tweet in session storage, it's a direct navigation.
                // We should ideally fetch the main tweet here, but per instructions,
                // we are now only fetching replies. For this to work, we'd need a fallback.
                // For now, we'll just show notFound if sessionStorage is empty.
                setTweet(null); 
            }
        };

        if (loggedInUser) {
            fetchTweetAndReplies();
        }
    }, [id, loggedInUser]);

    useEffect(() => {
      const handleBeforeUnload = () => {
        sessionStorage.setItem('isNavigatingBack', 'true');
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

    if (tweet === undefined) {
        return (
             <div className="min-h-screen bg-background text-foreground">
                 <div className="container mx-auto flex justify-center px-4">
                    <main className="w-full max-w-[720px]">
                        <div className="flex justify-center items-center h-screen">
                             <Loader2 className="animate-spin text-muted-foreground" size={24} />
                            <p className="ml-2">Loading post...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (tweet === null) {
        notFound();
    }

    const { authorName, authorUserName, authorProfilePicture, createdAt, text, fullText, images, replyCount, retweetCount, likeCount, viewCount, bookmarkCount, suggestions, replied_status, quoteData, VideoPresent, VideoUrl } = tweet;
    
    let imageUrls: string[] = [];
    if (typeof images === 'string' && images.trim() !== '') {
      if (images.startsWith('[') && images.endsWith(']')) {
        try {
          const parsed = JSON.parse(images);
          if (Array.isArray(parsed)) {
              imageUrls = parsed;
          }
        } catch (e) {
          console.error("Failed to parse images JSON string in PostPage:", e);
        }
      } else {
        // Handle comma-separated strings
        imageUrls = images.split(',').map(url => url.trim()).filter(url => url.length > 0);
      }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex justify-center">
            <div className="w-full flex justify-center gap-8">
                <div className="w-full max-w-[720px]">
                    <header className="flex items-center gap-4 h-[53px] sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border -mx-4 px-4">
                        <Link href="/feed" className="text-primary hover:bg-muted p-2 rounded-full -ml-2">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-bold text-xl font-headline">Post</h2>
                    </header>

                    <div className="px-4 py-3">
                        <div className="flex items-start gap-3 mb-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
                                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid">
                                <p className="font-bold text-base leading-tight">{authorName}</p>
                                <p className="text-muted-foreground text-sm leading-tight">@{authorUserName}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xl leading-relaxed whitespace-pre-wrap">{fullText || text}</p>

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
                                <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                                    <MediaGrid images={imageUrls} />
                                </div>
                            )}

                            {quoteData && quoteData.length > 0 && (
                                <div className="mt-3">
                                  <QuoteCard quote={quoteData[0]} />
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground my-3">
                            {formattedTime ? (
                                <>
                                    <span>{formattedTime}</span> · <span className="font-bold text-foreground">{formatNumber(viewCount)}</span> Views
                                </>
                            ) : (
                                <span className="font-bold text-foreground">{formatNumber(viewCount)}</span>
                            )}
                        </div>

                        <Separator className="my-2" />

                        <div className="py-1">
                            <div className="flex justify-around items-center text-muted-foreground">
                                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 hover:text-primary`}>
                                    <MessageCircle size={22} strokeWidth={1.5} />
                                    {replyCount > 0 && <span className="font-semibold text-sm">{formatNumber(replyCount)}</span>}
                                </div>
                                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 hover:text-green-500`}>
                                    <Repeat2 size={22} strokeWidth={1.5} />
                                    {retweetCount > 0 && <span className="font-semibold text-sm">{formatNumber(retweetCount)}</span>}
                                </div>
                                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 hover:text-red-500`}>
                                    <Heart size={22} strokeWidth={1.5} />
                                    {likeCount > 0 && <span className="font-semibold text-sm">{formatNumber(likeCount)}</span>}
                                </div>
                                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 hover:text-primary`}>
                                    <Bookmark size={22} strokeWidth={1.5} />
                                    {bookmarkCount > 0 && <span className="font-semibold text-sm">{formatNumber(bookmarkCount)}</span>}
                                 </div>
                                <div className={`flex items-center gap-2 text-sm transition-colors duration-200 hover:text-primary`}>
                                    <Upload size={22} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                        <Separator className="my-2" />
                    </div>

                    <div className="relative -mx-4">
                      {replies.length > 0 && (
                        <div className="absolute left-10 top-0 h-full w-0.5 bg-border -z-10 -ml-px"></div>
                      )}
                      {isLoadingReplies ? (
                           <div className="flex justify-center items-center py-10">
                              <Loader2 className="animate-spin text-muted-foreground" size={24} />
                              <p className="ml-2 text-muted-foreground">Loading replies...</p>
                          </div>
                      ) : replies.length > 0 ? (
                          replies.map(reply => (
                              <ReplyCard key={reply.id} reply={reply} />
                          ))
                      ) : (
                          <div className="text-center text-muted-foreground py-10">
                              <p>No replies yet.</p>
                          </div>
                      )}
                    </div>
                </div>
                 {replied_status === 'PENDING' && loggedInUser && (
                    <aside className="hidden lg:block w-[420px] xl:w-[480px] flex-shrink-0 pt-4">
                        <ReplySuggestions postId={id} userName={loggedInUser.name} />
                    </aside>
                )}
            </div>
        </div>
    );
}

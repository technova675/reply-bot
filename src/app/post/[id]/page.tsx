
// Post page: /post/:id — uses local data for demo
import { getTweetById } from '@/lib/data';
import type { Tweet, ReplySuggestion } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumber, TweetTime } from '@/lib/utils';
import { MessageCircle, Repeat2, Heart, Upload, ArrowLeft, Bookmark } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ReplyCard from '@/components/reply-card';
import ReplySuggestions from '@/components/reply-suggestions';
import GlobalHeader from '@/components/global-header';

type PostPageProps = {
    params: {
        id: string;
    };
};

export default async function PostPage({ params }: PostPageProps) {
    const tweet = await getTweetById(params.id);

    if (!tweet) {
        notFound();
    }

    const { authorName, authorUserName, authorProfilePicture, createdAt, text, fullText, media, replyCount, retweetCount, likeCount, viewCount, bookmarkCount, replyList, suggestions } = tweet;
    
    // Transform string array from API to the object array the component expects
    const initialSuggestions: ReplySuggestion[] = suggestions?.map(s => ({ text: s })) || [];

    // The API may return media as a stringified JSON array, so we need to parse it.
    let parsedMedia: { media_url_https: string, type: string }[] = [];
    try {
        if (typeof media === 'string') {
            const mediaArray = JSON.parse(media);
            if (Array.isArray(mediaArray) && mediaArray.length > 0 && typeof mediaArray[0] === 'string') {
                // Handle array of strings
                parsedMedia = mediaArray.map((url: string) => ({ media_url_https: url, type: 'photo' }));
            } else if (Array.isArray(mediaArray)) {
                // Handle array of objects
                parsedMedia = mediaArray;
            }
        } else if (Array.isArray(media)) {
            // If it's already an array of objects, use it directly.
            parsedMedia = media as any[];
        }
    } catch (error) {
        console.error("Failed to parse media JSON string on post page:", error);
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <GlobalHeader />
            <div className="container mx-auto flex justify-center gap-8 px-4">
                <main className="w-full max-w-[720px]">
                    <header className="flex items-center gap-4 h-[53px] sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border -mx-4 px-4">
                        <Link href="/" className="text-primary hover:bg-muted p-2 rounded-full -ml-2">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="font-bold text-xl font-headline">Post</h2>
                    </header>

                    <div className="px-4 py-3">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={authorProfilePicture} alt={`${authorName}'s avatar`} />
                                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid">
                                <p className="font-bold text-base leading-tight">{authorName}</p>
                                <p className="text-muted-foreground text-sm leading-tight">@{authorUserName}</p>
                            </div>
                        </div>

                        <p className="text-xl leading-relaxed whitespace-pre-wrap my-3">{fullText || text}</p>

                        {parsedMedia.length > 0 && (
                            <div className="mt-3 grid gap-1 rounded-2xl overflow-hidden border border-border aspect-video">
                                {parsedMedia.map((item, index) => (
                                    <div key={item.media_url_https || index} className="relative w-full h-full">
                                        <Image
                                            src={item.media_url_https}
                                            alt={`Tweet media ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-sm text-muted-foreground my-3">
                            <span>{TweetTime(createdAt)}</span> · <span className="font-bold text-foreground">{formatNumber(viewCount)}</span> Views
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
                    <Separator className="my-2" />
                    <div className="-mx-4">
                        {replyList && replyList.length > 0 ? (
                            replyList.map(reply => (
                                <ReplyCard key={reply.id} reply={reply} />
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No replies yet.</p>
                            </div>
                        )}
                    </div>
                </main>
                <aside className="hidden lg:block w-[420px] xl:w-[480px] flex-shrink-0 pt-4">
                    <div className="sticky top-[53px]">
                        <ReplySuggestions postId={params.id} initialSuggestions={initialSuggestions} />
                    </div>
                </aside>
            </div>
        </div>
    );
}

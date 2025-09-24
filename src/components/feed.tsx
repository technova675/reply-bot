"use client";

import type { Tweet } from '@/lib/types';
import TweetCard from './tweet-card';
import Link from 'next/link';

type FeedProps = {
  tweets: Tweet[];
};

export default function Feed({ tweets }: FeedProps) {
  const handleTweetClick = (tweet: Tweet) => {
    if (tweet && tweet.id) {
      sessionStorage.setItem(`tweet:${tweet.id}`, JSON.stringify(tweet));
    }
  };

  return (
    <section>
       <header className="sticky top-0 z-10 flex flex-col p-4 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold font-headline">Home</h1>
            </div>
        </header>
      <div className="flex flex-col items-center">
        {tweets.map((tweet, index) => (
          <Link
            key={tweet.id}
            href={`/post/${tweet.id}`}
            onClick={() => handleTweetClick(tweet)}
            className="w-full max-w-[720px] block"
          >
            <TweetCard tweet={tweet} isLCP={index === 0} />
          </Link>
        ))}
      </div>
    </section>
  );
}

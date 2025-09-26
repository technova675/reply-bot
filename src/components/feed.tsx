"use client";

import type { Tweet } from '@/lib/types';
import TweetCard from './tweet-card';
import Link from 'next/link';
import TopBar from './top-bar';

type FeedProps = {
  tweets: Tweet[];
  filter: string;
  setFilter: (filter: string) => void;
};

export default function Feed({ tweets, filter, setFilter }: FeedProps) {
  const handleTweetClick = (tweet: Tweet) => {
    if (tweet && tweet.id) {
      // Save the tweet data for the post page to use
      sessionStorage.setItem(`tweet:${tweet.id}`, JSON.stringify(tweet));
      
      // Save scroll position and post ID for restoring the feed
      const feedState = {
        scrollY: window.scrollY,
        postId: tweet.id,
      };
      sessionStorage.setItem('feedState', JSON.stringify(feedState));
    }
  };

  return (
    <section>
      <TopBar filter={filter} setFilter={setFilter} />
      <div className="flex flex-col items-center">
        {tweets.map((tweet, index) => (
          <Link
            key={tweet.id}
            id={`tweet-${tweet.id}`}
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

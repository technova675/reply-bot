"use client";

import type { Tweet } from '@/lib/types';
import TweetCard from './tweet-card';
import TopBar from './top-bar';
import { useState } from 'react';
import Link from 'next/link';

type FeedProps = {
  tweets: Tweet[];
};

export default function Feed({ tweets }: FeedProps) {
  const [filter, setFilter] = useState('all');

  const filteredTweets = tweets.filter(tweet => {
    if (filter === 'replied') {
      return tweet.isReplied === true;
    }
    if (filter === 'not-replied') {
      return !tweet.isReplied;
    }
    return true; // 'all'
  });

  const handleTweetClick = (tweet: Tweet) => {
    if (tweet && tweet.id) {
      sessionStorage.setItem(`tweet:${tweet.id}`, JSON.stringify(tweet));
    }
  };

  return (
    <section>
      <TopBar filter={filter} setFilter={setFilter} />
      <div className="flex flex-col items-center">
        {filteredTweets.map((tweet, index) => (
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

"use client";

import type { Tweet } from '@/lib/types';
import TweetCard from './tweet-card';
import TopBar from './top-bar';
import { useState } from 'react';

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

  return (
    <section>
      <TopBar filter={filter} setFilter={setFilter} />
      <div className="flex flex-col items-center">
        {filteredTweets.map((tweet, index) => (
          <div key={tweet.id} className="w-full max-w-[720px] ">
            <TweetCard tweet={tweet} isLCP={index === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}

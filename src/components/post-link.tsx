'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Tweet } from '@/lib/types';
import { setCachedTweet } from '@/lib/tweet-cache';

type PostLinkProps = {
  tweet: Tweet;
  children: React.ReactNode;
};

export default function PostLink({ tweet, children }: PostLinkProps) {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCachedTweet(tweet);
    router.push(`/post/${tweet.id}`);
  };

  return (
    <a href={`/post/${tweet.id}`} onClick={handleClick} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
      {children}
    </a>
  );
}

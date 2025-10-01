
'use client';

import { useState, useEffect } from 'react';
import type { Tweet } from '@/lib/types';
import { getTweets } from '@/lib/data';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import { Loader2 } from 'lucide-react';
import { setCachedTweets, getCachedTweets } from '@/lib/tweet-cache';
import { useAuth } from '@/hooks/use-auth';

export default function FeedPage() {
  const { loggedInUser, isLoading: isAuthLoading } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (!loggedInUser) return;

      const isNavigatingBack = sessionStorage.getItem('isNavigatingBack') === 'true';
      const cachedTweets = getCachedTweets();

      if (isNavigatingBack && cachedTweets.length > 0) {
        console.log("Loading tweets from cache on back navigation.");
        setTweets(cachedTweets);
        setIsLoading(false);
        sessionStorage.removeItem('isNavigatingBack'); // Reset the flag
      } else {
        setIsLoading(true);
        console.log(`Fetching fresh tweets for ${loggedInUser.name}...`);
        const tweetsData = await getTweets(loggedInUser.name);
        setCachedTweets(tweetsData);
        setTweets(tweetsData);
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      initialize();
    }
  }, [loggedInUser, isAuthLoading]);

  useEffect(() => {
    const feedStateJSON = sessionStorage.getItem('feedState');
    if (feedStateJSON) {
      const { postId } = JSON.parse(feedStateJSON);

      const restoreScroll = () => {
        const element = document.getElementById(`tweet-${postId}`);
        if (element) {
          element.scrollIntoView({ block: 'center' });
          // We only remove the feedState once scroll is restored
          sessionStorage.removeItem('feedState'); 
          return true;
        }
        return false;
      };

      // If we are not loading, try to restore scroll immediately.
      // Otherwise, wait for tweets to be rendered.
      if (!isLoading) {
        let attempts = 0;
        const attemptRestore = () => {
          attempts++;
          if (restoreScroll() || attempts > 50) { 
            return;
          }
          requestAnimationFrame(attemptRestore);
        };
        requestAnimationFrame(attemptRestore);
      }
    }
  }, [tweets, isLoading]);

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Loading user...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-180px)]">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {tweets.length > 0 ? (
        <Feed tweets={tweets} />
      ) : (
        <div className="text-center p-8 text-muted-foreground">
          No posts found
        </div>
      )}
      <DebugDrawer data={tweets} />
    </>
  );
}

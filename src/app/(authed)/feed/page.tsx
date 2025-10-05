
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Tweet } from '@/lib/types';
import { getTweets } from '@/lib/data';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import { Loader2 } from 'lucide-react';
import { setCachedTweets, getCachedTweets } from '@/lib/tweet-cache';
import { useAuth } from '@/hooks/use-auth';
import TopBar from '@/components/top-bar';

type FilterType = 'All' | 'Replied' | 'Yet to Reply';

export default function FeedPage() {
  const { loggedInUser, isLoading: isAuthLoading } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

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

  const filteredTweets = useMemo(() => {
    if (activeFilter === 'All') {
      return tweets;
    }
    if (activeFilter === 'Replied') {
      return tweets.filter(tweet => tweet.replied_status !== 'PENDING');
    }
    if (activeFilter === 'Yet to Reply') {
      return tweets.filter(tweet => tweet.replied_status === 'PENDING');
    }
    return tweets;
  }, [tweets, activeFilter]);


  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Loading user...</p>
      </div>
    );
  }

  const showTopBar = true; // Feed page always has a TopBar with filters

  return (
    <>
       {showTopBar && (
          <TopBar 
              pageTitle="Home" 
              activeFilter={activeFilter}
              onFilterChange={(filter) => setActiveFilter(filter as FilterType)}
              showFilters={true}
          />
        )}
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-180px)]">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
          <p className="ml-2">Loading...</p>
        </div>
      ) : filteredTweets.length > 0 ? (
        <Feed tweets={filteredTweets} />
      ) : (
        <div className="text-center p-8 text-muted-foreground">
          No posts found for this filter.
        </div>
      )}
      <DebugDrawer data={tweets} />
    </>
  );
}

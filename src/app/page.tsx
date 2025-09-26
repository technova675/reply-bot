
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Tweet } from '@/lib/types';
import { getTweets } from '@/lib/data';
import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import GlobalHeader from '@/components/global-header';
import { Loader2 } from 'lucide-react';
import { getCachedTweets, setCachedTweets, clearTweetCache } from '@/lib/tweet-cache';

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'replied', 'not-replied'
  const [isLoading, setIsLoading] = useState(true);
  const feedRestored = useRef(false);

  useEffect(() => {
    // This effect runs only once on mount to handle scroll restoration.
    if (feedRestored.current) return;

    const feedStateJSON = sessionStorage.getItem('feedState');
    if (feedStateJSON) {
      const { scrollY, postId } = JSON.parse(feedStateJSON);

      const restoreScroll = () => {
        // Try to find the element and scroll to it
        const element = document.getElementById(`tweet-${postId}`);
        if (element) {
          element.scrollIntoView({ block: 'center' });
          sessionStorage.removeItem('feedState');
          feedRestored.current = true;
          return true; // Stop trying
        }
        
        // Fallback to scrollY if element not found after some time
        if (scrollY !== undefined) {
          window.scrollTo(0, scrollY);
        }
        sessionStorage.removeItem('feedState');
        feedRestored.current = true;
        return true;
      };

      // Wait for the feed to render
      let attempts = 0;
      const attemptRestore = () => {
        attempts++;
        if (restoreScroll() || attempts > 50) { // Stop after ~1 second
          return;
        }
        requestAnimationFrame(attemptRestore);
      };
      
      requestAnimationFrame(attemptRestore);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      let fetchedTweets = getCachedTweets();
      if (fetchedTweets.length === 0) {
        console.log("Cache empty, fetching from network...");
        const [tweetsData] = await Promise.all([getTweets()]);
        // for (let t of tweetsData) {
        //   let quoteData: any[] = [];
        //   if (t.isQuote === true) {
        //     quoteData = quotesData.filter(q => q.conversationId === t.conversationId);
        //     t.quoteData = quoteData;
        //   } else {
        //     t.quoteData = quoteData;
        //   }
        // }
        fetchedTweets = tweetsData;
        setCachedTweets(fetchedTweets);
      } else {
        console.log("Loading tweets from cache.");
      }
      
      setTweets(fetchedTweets);
      setIsLoading(false);
    };

    fetchData();

    // Clear cache only on full page unload/refresh
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Check if it's a refresh or a close. sessionStorage persists through refresh.
      // We only clear if the user is truly leaving the page.
      // But for this simple implementation, we'll clear it to ensure fresh data on next visit.
      // A more complex strategy might be needed for perfect refresh vs. close detection.
      sessionStorage.removeItem('tweet_cache');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    let newFilteredTweets = tweets;
    if (filter === 'replied') {
      newFilteredTweets = tweets.filter(tweet => tweet.replied_status === 'COMPLETED');
    } else if (filter === 'not-replied') {
      newFilteredTweets = tweets.filter(tweet => tweet.replied_status === 'PENDING');
    }
    setFilteredTweets(newFilteredTweets);
  }, [tweets, filter]);

  return (
    <div className="bg-background text-foreground">
      <GlobalHeader />
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />
        <main className="flex-1 border-x border-border">
          {isLoading ? (
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
              <p className="ml-2">Loading tweets...</p>
            </div>
          ) : (
            <Feed tweets={filteredTweets} filter={filter} setFilter={setFilter} />
          )}
        </main>
      </div>
      <DebugDrawer data={filteredTweets} />
    </div>
  );
}

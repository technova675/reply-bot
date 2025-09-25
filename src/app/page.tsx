
'use client';

import { useState, useEffect } from 'react';
import type { Tweet } from '@/lib/types';
import { getTweets, getQuotes } from '@/lib/data';
import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import GlobalHeader from '@/components/global-header';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'replied', 'not-replied'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [fetchedTweets, fetchedQuotes] = await Promise.all([getTweets(), getQuotes()]);

      for (let t of fetchedTweets) {
        let quoteData: any[] = [];
        // @ts-ignore
        if (t.isQuote === true) {
          // @ts-ignore
          quoteData = fetchedQuotes.filter(q => q.conversationId === t.conversationId);
          t.quoteData = quoteData;
        } else {
          t.quoteData = quoteData;
        }
      }
      setTweets(fetchedTweets);
      setIsLoading(false);
    };
    fetchData();
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

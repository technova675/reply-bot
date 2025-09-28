
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Tweet, UserProfile } from '@/lib/types';
import { getTweets } from '@/lib/data';
import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import { Loader2 } from 'lucide-react';
import { getCachedTweets, setCachedTweets } from '@/lib/tweet-cache';
import TopBar from '@/components/top-bar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { users } from '@/lib/users';

export default function FeedPage() {
  const { loggedInUser, isLoading: isAuthLoading } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'replied', 'not-replied'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    if (!isAuthLoading) {
      setSelectedUser(loggedInUser);
    }
  }, [isAuthLoading, loggedInUser]);

  useEffect(() => {
    const initialize = async () => {
      if (!selectedUser) return;
      
      setIsLoading(true);
      const isNavigatingBack = sessionStorage.getItem('isNavigatingBack');
      
      if (isNavigatingBack) {
        console.log("Navigating back, using cache.");
        const cachedData = getCachedTweets();
        if (cachedData.length > 0) {
          setTweets(cachedData);
        } else {
          console.log("Cache was empty, fetching fresh data as a fallback.");
          const tweetsData = await getTweets(selectedUser.name);
          setCachedTweets(tweetsData);
          setTweets(tweetsData);
        }
        sessionStorage.removeItem('isNavigatingBack');
      } else {
        console.log(`Fresh load, fetching default tweets for ${selectedUser.name}...`);
        const tweetsData = await getTweets(selectedUser.name);
        setCachedTweets(tweetsData);
        setTweets(tweetsData);
      }
      setIsLoading(false);
    };

    if(selectedUser){
      initialize();
    }
  }, [selectedUser]); // This effect now depends on selectedUser being set

  useEffect(() => {
    let newFilteredTweets = tweets;
    if (filter === 'replied') {
      newFilteredTweets = tweets.filter(tweet => tweet.replied_status === 'COMPLETED');
    } else if (filter === 'not-replied') {
      newFilteredTweets = tweets.filter(tweet => tweet.replied_status === 'PENDING');
    }
    setFilteredTweets(newFilteredTweets);
  }, [tweets, filter]);

  useEffect(() => {
    const feedStateJSON = sessionStorage.getItem('feedState');
    if (feedStateJSON) {
      const { postId } = JSON.parse(feedStateJSON);

      const restoreScroll = () => {
        const element = document.getElementById(`tweet-${postId}`);
        if (element) {
          element.scrollIntoView({ block: 'center' });
          sessionStorage.removeItem('feedState');
          return true;
        }
        return false;
      };

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
  }, [tweets]);

  const handleUserChange = async (user: UserProfile) => {
    if (user.handle === selectedUser?.handle) return;

    setSelectedUser(user);
    sessionStorage.setItem('loggedInUserHandle', user.handle);
    setIsLoading(true);
    console.log(`User changed, fetching tweets for ${user.name}...`);
    const tweetsData = await getTweets(user.name);
    setCachedTweets(tweetsData);
    setTweets(tweetsData);
    setIsLoading(false);
  }

  if (isAuthLoading || !selectedUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Loading user...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />
        <main className="flex-1 border-x border-border">
          <TopBar 
            filter={filter} 
            setFilter={setFilter}
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={handleUserChange}
          />
          {isLoading ? (
            <div className="flex justify-center items-center h-[calc(100vh-180px)]">
              <Loader2 className="animate-spin text-muted-foreground" size={24} />
              <p className="ml-2">Loading tweets...</p>
            </div>
          ) : (
            <Feed tweets={filteredTweets} />
          )}
        </main>
      </div>
      <DebugDrawer data={filteredTweets} />
    </>
  );
}

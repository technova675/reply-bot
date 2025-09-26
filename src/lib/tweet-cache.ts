
'use client';

import type { Tweet } from './types';

const CACHE_KEY = 'tweet_cache';

export function setCachedTweets(tweets: Tweet[]) {
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(tweets));
        } catch (e) {
            console.error("Failed to save tweets to sessionStorage", e);
        }
    }
}

export function getCachedTweets(): Tweet[] {
    if (typeof window !== 'undefined') {
        try {
            const cachedData = sessionStorage.getItem(CACHE_KEY);
            return cachedData ? JSON.parse(cachedData) : [];
        } catch (e) {
            console.error("Failed to retrieve tweets from sessionStorage", e);
            return [];
        }
    }
    return [];
}

export function getCachedTweetById(id: string | undefined): Tweet | undefined {
    if (!id) return undefined;
    const tweets = getCachedTweets();
    return tweets.find(tweet => tweet.id === id);
}

export function clearTweetCache() {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CACHE_KEY);
        console.log("Tweet cache cleared from sessionStorage.");
    }
}

export function setCachedTweet(tweet: Tweet) {
    const tweets = getCachedTweets();
    const index = tweets.findIndex(t => t.id === tweet.id);
    if (index > -1) {
        tweets[index] = tweet;
    } else {
        tweets.push(tweet);
    }
    setCachedTweets(tweets);
}

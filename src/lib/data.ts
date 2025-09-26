import type { Reply, Tweet, UserProfile } from './types';

const TWEET_LIST_URL = 'https://krishnavir.app.n8n.cloud/webhook/0a587209-3bfa-4bfb-aa41-6187541931d4';
const TWEET_REPLY_URL = "https://krishnavir.app.n8n.cloud/webhook/ff70f5fb-a2cb-4103-814e-314a515c4d88";
// const QUOTES_URL = "https://krishnavir.app.n8n.cloud/webhook-test/d08bcddb-eb90-405d-ac05-491ce7035bc6";

/**
 * Fetches the full list of tweets from the n8n workflow.
 */
export async function getTweets(): Promise<Tweet[]> {
  try {
    const response = await fetch(TWEET_LIST_URL, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error('Failed to fetch tweets from n8n workflow. Status:', response.status);
      return []; // Return an empty array to prevent the app from crashing.
    }
    
    const data = await response.json();
    console.log(data, "tweet")
    return data as Tweet[];
  } catch (error) {
    console.error('An error occurred while fetching tweets:', error);
    return []; // Return empty array on network error
  }
}

/**
 * Fetches the replies for a single tweet by its ID.
 * @param id The ID of the tweet to fetch replies for.
 */
export async function getTweetRepliesById(id: string): Promise<Reply[] | undefined> {
  try {
    const url = new URL(TWEET_REPLY_URL);
    url.searchParams.append('id', id);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', 
    });

    if (response.status === 301) {
      console.warn(`Received a 301 redirect for tweet ID ${id}. Returning empty replies.`);
      return [];
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch replies for tweet with id ${id}. Status:`, response.status);
      return undefined;
    }

    const data = await response.json();
    
    // The webhook returns an array of reply objects.
    if (Array.isArray(data)) {
        return data as Reply[];
    }

    console.error(`Unexpected data format for replies for tweet with id ${id}:`, data);
    return undefined;
    
  } catch (error) {
    console.error(`An error occurred while fetching replies for tweet ID ${id}:`, error);
    return undefined;
  }
}

/**
//  * Fetches quotes from the n8n workflow.
//  */
// export async function getQuotes(): Promise<any[]> {
//   try {
//     const response = await fetch(QUOTES_URL, { cache: 'no-store' });
//     if (!response.ok) {
//       console.error('Failed to fetch quotes from n8n workflow. Status:', response.status);
//       return [];
//     }
//     const data = await response.json();
//     return data as any[];
//   } catch (error) {
//     console.error('An error occurred while fetching quotes:', error);
//     return [];
//   }
// }

import type { Tweet } from './types';

const TWEET_LIST_URL = 'https://krishnavir.app.n8n.cloud/webhook/e2269146-987f-422f-801d-0f05bc1a336a';
const TWEET_REPLY_URL = "https://krishnavir.app.n8n.cloud/webhook/ff70f5fb-a2cb-4103-814e-314a515c4d88";

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
    return data as Tweet[];
  } catch (error) {
    console.error('An error occurred while fetching tweets:', error);
    return []; // Return empty array on network error
  }
}

/**
 * Fetches a single tweet by its ID from the main tweet list.
 * This function gets all tweets and then finds the one with the matching ID.
 * @param id The ID of the tweet to fetch.
 */
export async function getTweetById(id: string): Promise<Tweet | undefined> {
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

    if (!response.ok) {
      console.error(`Failed to fetch tweet with id ${id}. Status:`, response.status);
      return undefined;
    }

    const data = await response.json();
    console.log(data, "data")
    // Assuming the webhook returns an array with the tweet object inside
    if (Array.isArray(data) && data.length > 0) {
        return data[0] as Tweet;
    }
    // If it returns the object directly
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        return data as Tweet;
    }

    console.error(`Unexpected data format for tweet with id ${id}:`, data);
    return undefined;
    
  } catch (error) {
    console.error(`An error occurred while fetching tweet by ID ${id}:`, error);
    return undefined;
  }
}

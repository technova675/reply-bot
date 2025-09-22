'use server';

import type { ReplySuggestion } from './types';

// This is a placeholder for a server action.
// In a real application, this would interact with a database.
// For this demo, we're just logging the handle to the console.
// Writing to a local JSON file from a server action is not a standard
// or scalable practice for production apps.

export async function saveHandle(handle: string) {
  const webhookUrl = 'https://krishnavir.app.n8n.cloud/webhook/3cc6245e-1f14-4b44-a5f9-dc35aa017169';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ handle }),
    });

    if (!response.ok) {
      // Handle non-successful responses
      const errorText = await response.text();
      console.error(`Webhook call failed with status: ${response.status}`, errorText);
      // We can return a more specific error to the client if needed
      return { success: false, error: `Webhook failed: ${response.statusText}` };
    }
  
    return { success: true };

  } catch (error) {
    console.error('[Server Action] Error sending handle to webhook:', error);
    return { success: false, error: 'Failed to send data.' };
  }
}

/**
 * Fetches new reply suggestions for a given post ID from the n8n workflow.
 * @param postId The ID of the post to get suggestions for.
 */
export async function getSuggestions(postId: string): Promise<ReplySuggestion[]> {
  const url = 'https://krishnavir.app.n8n.cloud/webhook/64313aa3-aee7-4c42-be5f-f19f796a3601';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: postId }),
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error('Failed to fetch suggestions from n8n. Status:', response.status);
      return [];
    }

    const data = await response.json();
    
    // The API might return an array with one object: `[{ "content": [...] }]`
    if (Array.isArray(data) && data.length > 0 && data[0].content && Array.isArray(data[0].content)) {
      return data[0].content.map((text: string) => ({ text }));
    }
    
    // The API might return a direct object: `{ "content": [...] }`
    if (data.content && Array.isArray(data.content)) {
      return data.content.map((text: string) => ({ text }));
    }

    return []; 
  } catch (error) {
    console.error('An error occurred while fetching suggestions:', error);
    return [];
  }
}

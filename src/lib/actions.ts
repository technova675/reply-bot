
'use server';

import type { ReplySuggestion, Founder } from './types';
import { promises as fs } from 'fs';
import path from 'path';

const JOBS_LIST_URL = 'https://krishnavir.app.n8n.cloud/webhook/07021df9-8bf1-447f-8df1-f4a72a6f334f';
const SEND_DM_URL = 'https://krishnavir.app.n8n.cloud/webhook/0057b680-e303-4f9c-9cc8-3678eb055414';

// This is a placeholder for a server action.
// In a real application, this would interact with a database.
// For this demo, we're just logging the handle to the console.
// Writing to a local JSON file from a server action is not a standard
// or scalable practice for production apps.

/**
 * Fetches new reply suggestions for a given post ID from the n8n workflow.
 * @param postId The ID of the post to get suggestions for.
 * @param userName The name of the user to get suggestions for.
 */
export async function getSuggestions(postId: string, userName: string): Promise<ReplySuggestion[]> {
  const url = 'https://krishnavir.app.n8n.cloud/webhook/64313aa3-aee7-4c42-be5f-f19f796a3601';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: postId, userName: userName }),
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error('Failed to fetch suggestions from n8n. Status:', response.status);
      return [];
    }

    const responseText = await response.text();
    if (!responseText) {
      return []; // Return empty array if response body is empty
    }

    const data = JSON.parse(responseText);

    // The API returns an array of objects, where each object has a 'content' property which is an array of strings.
    if (Array.isArray(data) && data.length > 0) {
      return data.map(item => ({
        content: item.content || [],
      }));
    }

    console.log("SUGGESTION data format unexpected =>", data);
    return []; 
  } catch (error) {
    console.error('An error occurred while fetching suggestions:', error);
    return [];
  }
}


/**
 * Marks a job as not interested.
 * @param jobId The ID of the job to update.
 */
export async function markJobAsNotInterested(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = new URL(JOBS_LIST_URL);
    url.searchParams.append('id', jobId);
    url.searchParams.append('interested', 'no');
    url.searchParams.append('updateStatus', 'true');

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Failed to mark job as not interested. Status:', response.status, 'Body:', errorBody);
      return { success: false, error: `Server responded with status ${response.status}` };
    }
    
    return { success: true };
  } catch (error) {
    console.error('An error occurred while marking job as not interested:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

/**
 * Sends a DM for a job application.
 * @param jobId The ID of the job.
 * @param dmText The text of the direct message.
 * @param userId The ID of the user sending the DM.
 * @param userName The name of the user sending the DM.
 */
export async function sendJobDM(jobId: string, dmText: string, userId: number | string, userName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(SEND_DM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        dm_text: dmText, 
        job_id: jobId,
        userId: userId,
        userName: userName,
       }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Failed to send DM. Status:', response.status, 'Body:', errorBody);
      return { success: false, error: `Server responded with status ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('An error occurred while sending DM:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}


/**
 * Fetches the list of founders from the n8n workflow.
 */
export async function getFounders(): Promise<Founder[]> {
  const url = 'https://krishnavir.app.n8n.cloud/webhook/400c2b32-fb68-4d27-af87-6764ceae421f';
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      console.error('Failed to fetch founders from n8n workflow. Status:', response.status);
      return [];
    }
    const data = await response.json();
    return data as Founder[];
  } catch (error) {
    console.error('An error occurred while fetching founders:', error);
    return [];
  }
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export  function TweetTime(time: string):string {
  const rawTime = time;

  // Convert to Date object
  const date = new Date(rawTime);

  // Format like Twitter → "5:41 PM · Sep 19, 2025"
  const formattedTime = format(date, "h:mm a '·' MMM d, yyyy");

  return formattedTime
}

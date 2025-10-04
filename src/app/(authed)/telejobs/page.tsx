
'use client';

import { useState, useEffect } from 'react';
import { getTelegramJobs } from '@/lib/data';
import type { TelegramJob } from '@/lib/types';
import TelegramJobCard from '@/components/telegram-job-card';
import { Loader2 } from 'lucide-react';

export default function TelejobsPage() {
  const [jobs, setJobs] = useState<TelegramJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const jobsData = await getTelegramJobs();
      setJobs(jobsData);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-180px)]">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {jobs.length > 0 ? (
        jobs.map(job => (
          <TelegramJobCard key={job.id} job={job} />
        ))
      ) : (
        <div className="text-center p-8 text-muted-foreground col-span-full">
          No Telegram jobs found.
        </div>
      )}
    </div>
  );
}

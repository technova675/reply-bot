
'use client';

import { useState, useEffect } from 'react';
import { getJobs } from '@/lib/data';
import type { Job } from '@/lib/types';
import JobCard from '@/components/job-card';
import { Loader2 } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const jobsData = await getJobs();
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
    <div>
      {jobs.length > 0 ? (
        jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))
      ) : (
        <div className="text-center p-8 text-muted-foreground">
          No jobs found.
        </div>
      )}
    </div>
  );
}

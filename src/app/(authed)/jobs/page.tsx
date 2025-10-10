
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getJobs } from '@/lib/data';
import type { Job } from '@/lib/types';
import JobCard from '@/components/job-card';
import { Loader2 } from 'lucide-react';
import TopBar from '@/components/top-bar';
import { format } from 'date-fns';

export type JobFilterType = 'All' | 'DM Done' | 'Yet To DM';

type GroupedJobs = {
  [date: string]: Job[];
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<JobFilterType>('All');

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const jobsData = await getJobs();
      setJobs(jobsData);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);
  
  const filteredJobs = useMemo(() => {
    if (activeFilter === 'All') {
      return jobs;
    }
    if (activeFilter === 'DM Done') {
      return jobs.filter(job => job.applied_status !== 'PENDING');
    }
    if (activeFilter === 'Yet To DM') {
      return jobs.filter(job => job.applied_status === 'PENDING');
    }
    return jobs;
  }, [jobs, activeFilter]);

  const groupedJobs = useMemo(() => {
    return filteredJobs.reduce((acc: GroupedJobs, job) => {
      if (!job.createdAt) return acc;
      const jobDate = new Date(job.createdAt);
      const formattedDate = format(jobDate, 'MMMM d, yyyy');
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(job);
      return acc;
    }, {});
  }, [filteredJobs]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedJobs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [groupedJobs]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-180px)]">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  const filterTabs = [
    { value: 'All', label: 'All' },
    { value: 'DM Done', label: 'DM Done' },
    { value: 'Yet To DM', label: 'Yet To DM' },
  ];

  return (
    <div>
        <TopBar
            pageTitle="Jobs"
            activeFilter={activeFilter}
            onFilterChange={(filter) => setActiveFilter(filter as JobFilterType)}
            showFilters={true}
            filterTabs={filterTabs}
        />
      {sortedDates.length > 0 ? (
        sortedDates.map(date => (
          <div key={date}>
            <div className="sticky top-[109px] z-10 bg-background/80 backdrop-blur-sm p-4 border-b border-t border-border">
              <h2 className="font-bold text-lg">{date} <span className="text-muted-foreground font-normal text-base">({groupedJobs[date].length} jobs)</span></h2>
            </div>
            {groupedJobs[date].map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ))
      ) : (
        <div className="text-center p-8 text-muted-foreground">
          No jobs found for this filter.
        </div>
      )}
    </div>
  );
}

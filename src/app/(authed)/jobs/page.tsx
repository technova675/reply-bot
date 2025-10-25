
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getJobs } from '@/lib/data';
import type { Job } from '@/lib/types';
import JobCard from '@/components/job-card';
import { Loader2 } from 'lucide-react';
import TopBar from '@/components/top-bar';
import { markJobAsNotInterested, sendJobDM } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export type JobFilterType = 'All' | 'DM Done' | 'Yet To DM';

type UpdatingState = {
  id: string;
  action: 'dm' | 'not-interested';
} | null;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setJobActiveFilter] = useState<JobFilterType>('All');
  const [updatingJob, setUpdatingJob] = useState<UpdatingState>(null);
  const { toast } = useToast();
  const { loggedInUser } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const jobsData = await getJobs();
      setJobs(jobsData);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const handleNotInterested = useCallback(async (jobId: string) => {
    setUpdatingJob({ id: jobId, action: 'not-interested' });
    try {
      const result = await markJobAsNotInterested(jobId);
      if (result.success) {
        setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
        toast({
          description: "Job marked as not interested.",
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error("Failed to mark job as not interested:", error);
      toast({
        variant: "destructive",
        description: "Could not update job status. Please try again.",
      });
    } finally {
      setUpdatingJob(null);
    }
  }, [toast]);
  
  const handleSendDM = useCallback(async (jobId: string, dmText: string) => {
    const jobToUpdate = jobs.find(job => job.id === jobId);
    if (!jobToUpdate) {
        toast({
            variant: "destructive",
            description: "Job not found. Please refresh and try again.",
        });
        return false;
    }

    setUpdatingJob({ id: jobId, action: 'dm' });
    try {
      const result = await sendJobDM(jobId, dmText, jobToUpdate.userData.id, jobToUpdate.userData.name);
      if (result.success) {
        setJobs(currentJobs => 
          currentJobs.map(job => 
            job.id === jobId ? { ...job, dm_status: true } : job
          )
        );
        toast({
          description: "DM sent successfully!",
        });
        return true; // Indicate success
      } else {
         throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
       console.error("Failed to send DM:", error);
      toast({
        variant: "destructive",
        description: "Could not send DM. Please try again.",
      });
      return false; // Indicate failure
    } finally {
      setUpdatingJob(null);
    }
  }, [jobs, toast]);

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'DM Done') {
      return jobs.filter(job => job.dm_status === true);
    }
    if (activeFilter === 'Yet To DM') {
      return jobs.filter(job => job.dm_status === false && job.userData.canDm === true);
    }
    // 'All' or any other case
    return jobs;
  }, [jobs, activeFilter]);

  const pageTitle = jobs.length > 0 ? `Jobs (${jobs.length})` : 'Jobs';

  return (
    <>
      <TopBar 
        pageTitle={pageTitle}
        activeFilter={activeFilter}
        onFilterChange={(filter) => setJobActiveFilter(filter as JobFilterType)}
        showFilters={true}
        filterTabs={[
          { value: 'All', label: 'All' },
          { value: 'DM Done', label: 'DM Done' },
          { value: 'Yet To DM', label: 'Yet To DM' },
        ]}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-180px)]">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
          <p className="ml-2">Loading...</p>
        </div>
      ) : (
        <div>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onNotInterested={handleNotInterested}
                onSendDM={handleSendDM}
                isMarkingNotInterested={updatingJob?.id === job.id && updatingJob?.action === 'not-interested'}
                isSendingDM={updatingJob?.id === job.id && updatingJob?.action === 'dm'}
              />
            ))
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No jobs found for this filter.
            </div>
          )}
        </div>
      )}
    </>
  );
}

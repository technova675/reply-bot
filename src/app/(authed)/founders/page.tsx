
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getFounders } from '@/lib/actions';
import type { Founder } from '@/lib/types';
import FounderCard from '@/components/founder-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TopBar from '@/components/top-bar';
import FounderFilters from '@/components/founder-filters';
import Loading from './loading';

const ITEMS_PER_PAGE = 50;
export type FounderFilterType = 'All' | 'To DM' | 'DM Sent';

function FoundersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [allFounders, setAllFounders] = useState<Founder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentFilter = (searchParams.get('filter') as FounderFilterType) || 'All';
  
  useEffect(() => {
    const fetchFounders = async () => {
      setIsLoading(true);
      const foundersData = await getFounders();
      setAllFounders(foundersData);
      setIsLoading(false);
    };
    fetchFounders();
  }, []);

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filter);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredFounders = useMemo(() => {
    return allFounders.filter(founder => {
      if (currentFilter === 'DM Sent') {
        return founder.dm_status === true;
      }
      if (currentFilter === 'To DM') {
        return founder.dm_status === false;
      }
      return true; // 'All' filter
    });
  }, [allFounders, currentFilter]);

  const totalPages = Math.ceil(filteredFounders.length / ITEMS_PER_PAGE);
  const paginatedFounders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFounders.slice(startIndex, endIndex);
  }, [filteredFounders, currentPage]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <TopBar pageTitle="Founders">
          <FounderFilters
            activeFilter={currentFilter}
            onFilterChange={handleFilterChange}
            filterTabs={[
              { value: 'All', label: 'All' },
              { value: 'To DM', label: 'To DM' },
              { value: 'DM Sent', label: 'DM Sent' },
            ]}
          />
      </TopBar>
      <div>
        {paginatedFounders.length > 0 ? (
          paginatedFounders.map(founder => (
            <FounderCard key={founder.id} founder={founder} />
          ))
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No founders found for this filter.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 p-4 border-t border-border">
          <Button asChild variant="outline" disabled={currentPage === 1}>
             <Link href={`/founders?filter=${currentFilter}&page=${currentPage - 1}`}>Previous</Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button asChild variant="outline" disabled={currentPage === totalPages}>
             <Link href={`/founders?filter=${currentFilter}&page=${currentPage + 1}`}>Next</Link>
          </Button>
        </div>
      )}
    </>
  );
}

export default function FoundersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FoundersContent />
    </Suspense>
  );
}

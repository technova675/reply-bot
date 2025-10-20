
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from 'react';

type FilterTab = { value: string; label: string; };

type FounderFiltersProps = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filterTabs: FilterTab[];
};

export default function FounderFilters({ activeFilter, onFilterChange, filterTabs }: FounderFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentFilter, setCurrentFilter] = useState(activeFilter);

  useEffect(() => {
    // Sync local state with URL search params on mount
    const filterFromUrl = searchParams.get('filter') || 'All';
    setCurrentFilter(filterFromUrl);
    onFilterChange(filterFromUrl);
  }, [searchParams, onFilterChange]);
  

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    onFilterChange(filter);
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filter);
    params.set('page', '1'); // Reset to first page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="px-4 pb-3">
      <Tabs
        value={currentFilter}
        onValueChange={handleFilterChange}
        className="w-full"
      >
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${filterTabs.length}, minmax(0, 1fr))` }}
        >
          {filterTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full justify-center"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

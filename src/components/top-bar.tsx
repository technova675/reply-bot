'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterTab = { value: string; label: string; };

type TopBarProps = {
  pageTitle: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  showFilters?: boolean;
  filterTabs?: FilterTab[];
};

const defaultFilterTabs: FilterTab[] = [
  { value: "All", label: "All" },
  { value: "Replied", label: "Replied" },
  { value: "Yet to Reply", label: "Yet to Reply" },
];

export default function TopBar({
  pageTitle,
  activeFilter,
  onFilterChange,
  showFilters = false,
  filterTabs = defaultFilterTabs,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-col bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold font-headline">{pageTitle}</h1>
        </div>
      </div>

      {showFilters && (
        <div className="px-4 pb-3">
          <Tabs
            value={activeFilter}
            defaultValue={activeFilter ?? "All"}
            onValueChange={onFilterChange}
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
      )}
    </header>
  );
}

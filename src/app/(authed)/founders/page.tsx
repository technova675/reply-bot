
// import { getFounders } from '@/lib/actions';
// import type { Founder } from '@/lib/types';
// import FounderCard from '@/components/founder-card';
// import TopBar from '@/components/top-bar';

// export default async function FoundersPage() {
//   const founders: Founder[] = await getFounders();

//   return (
//     <div>
//       <TopBar pageTitle="Founders" />
//       <div>
//         {founders.length > 0 ? (
//           founders.map(founder => (
//             <FounderCard key={founder.id} founder={founder} />
//           ))
//         ) : (
//           <div className="text-center p-8 text-muted-foreground">
//             No founders found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// import { getFounders } from '@/lib/actions';
// import type { Founder } from '@/lib/types';
// import FounderCard from '@/components/founder-card';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// const ITEMS_PER_PAGE = 50;
// export type FounderFilterType = 'All' | 'To DM' | 'DM Sent';

// export default async function FoundersPage({
//   searchParams,
// }: {
//   searchParams?: {
//     page?: string;
//     filter?: string;
//   };
// }) {
//   // Fetch all founders once on the server
//   const allFounders: Founder[] = await getFounders();
  
//   const currentPage = Number(searchParams?.page) || 1;
//   const currentFilter = searchParams?.filter || 'All';

//   // Server-side filtering logic
//   const filteredFounders = allFounders.filter(founder => {
//     if (currentFilter === 'DM Sent') {
//       return founder.dm_status === true;
//     }
//     if (currentFilter === 'To DM') {
//       return founder.dm_status === false;
//     }
//     return true; // 'All' filter
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredFounders.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const paginatedFounders = filteredFounders.slice(startIndex, endIndex);

//   return (
//     <div>
//       <div>
//         {paginatedFounders.length > 0 ? (
//           paginatedFounders.map(founder => (
//             <FounderCard key={founder.id} founder={founder} />
//           ))
//         ) : (
//           <div className="text-center p-8 text-muted-foreground">
//             No founders found for this filter.
//           </div>
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 p-4 border-t border-border">
//           <Button asChild variant="outline" disabled={currentPage === 1}>
//              <Link href={`/founders?filter=${currentFilter}&page=${currentPage - 1}`}>Previous</Link>
//           </Button>
//           <span className="text-sm text-muted-foreground">
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button asChild variant="outline" disabled={currentPage === totalPages}>
//              <Link href={`/founders?filter=${currentFilter}&page=${currentPage + 1}`}>Next</Link>
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


import { getFounders } from '@/lib/actions';
import type { Founder } from '@/lib/types';
import FounderCard from '@/components/founder-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ITEMS_PER_PAGE = 50;
export type FounderFilterType = 'All' | 'To DM' | 'DM Sent';

export default async function FoundersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  // Resolve the promise that Next.js hands you
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const currentFilter = resolvedSearchParams?.filter || 'All';

  // Fetch all founders once on the server
  const allFounders: Founder[] = await getFounders();

  // Server-side filtering logic
  const filteredFounders = allFounders.filter(founder => {
    if (currentFilter === 'DM Sent') {
      return founder.dm_status === true;
    }
    if (currentFilter === 'To DM') {
      return founder.dm_status === false;
    }
    return true; // 'All' filter
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFounders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFounders = filteredFounders.slice(startIndex, endIndex);

  return (
    <div>
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
    </div>
  );
}
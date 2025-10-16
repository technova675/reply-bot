
import { getFounders } from '@/lib/actions';
import type { Founder } from '@/lib/types';
import FounderCard from '@/components/founder-card';
import TopBar from '@/components/top-bar';

export default async function FoundersPage() {
  const founders: Founder[] = await getFounders();

  return (
    <div>
      <TopBar pageTitle="Founders" />
      <div>
        {founders.length > 0 ? (
          founders.map(founder => (
            <FounderCard key={founder.id} founder={founder} />
          ))
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No founders found.
          </div>
        )}
      </div>
    </div>
  );
}

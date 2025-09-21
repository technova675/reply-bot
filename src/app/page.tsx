import { getTweets } from '@/lib/data';
import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import GlobalHeader from '@/components/global-header';

export default async function Home() {
  const tweets = await getTweets();

  return (
    <div className="bg-background text-foreground">
       <GlobalHeader />
      <div className="container mx-auto flex min-h-screen">
        <Sidebar />
        <main className="flex-1 border-x border-border">
          {/* Feed column will internally center the tweet cards */}
          <Feed tweets={tweets} />
        </main>
        {/* Right-side recommendations (WhoToFollow) removed as requested */}
      </div>
      <DebugDrawer data={tweets} />
    </div>
  );
}

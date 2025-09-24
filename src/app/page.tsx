import { getTweets, getQuotes } from '@/lib/data';
import Sidebar from '@/components/sidebar';
import Feed from '@/components/feed';
import DebugDrawer from '@/components/debug-drawer';
import GlobalHeader from '@/components/global-header';

export default async function Home() {
  const tweets = await getTweets();
  const quotes = await getQuotes();
  
  for (let t of tweets) {
    let quoteData: any[] = [];
    // @ts-ignore
    if (t.isQuote === true) {
      // @ts-ignore
      quoteData = quotes.filter(q => q.conversationId === t.conversationId);
      t.quoteData = quoteData;
    } else {
      t.quoteData = quoteData;
    }
  }

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

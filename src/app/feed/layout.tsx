// This layout is now defined in src/app/(authed)/layout.tsx to avoid routing conflicts.
// This file can be deleted.
export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

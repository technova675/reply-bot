export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent"></div>
        <p className="text-muted-foreground">Loading founders...</p>
      </div>
    </div>
  );
}

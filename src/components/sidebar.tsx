import Link from 'next/link';

export default function Sidebar() {
  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <header className="hidden sm:flex flex-col justify-between h-screen p-2 xl:p-4 sticky top-0">
        <div className="space-y-4">
          {/* Removed left navigation items as requested */}
        </div>
        <div>
          {/* User profile section can go here */}
        </div>
      </header>
      
      {/* Mobile: No bottom bar needed */}
    </>
  );
}

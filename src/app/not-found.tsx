import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
      <p className="text-muted-foreground mb-6">Oops! We couldn't find the post you were looking for.</p>
      <Link href="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to feed
      </Link>
    </div>
  )
}

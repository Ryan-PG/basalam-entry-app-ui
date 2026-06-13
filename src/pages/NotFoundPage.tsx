import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-50 px-4 text-center">
      <p className="text-6xl font-bold text-brand-200">404</p>
      <h1 className="text-lg font-semibold text-neutral-700">Page not found</h1>
      <p className="max-w-sm text-sm text-neutral-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}

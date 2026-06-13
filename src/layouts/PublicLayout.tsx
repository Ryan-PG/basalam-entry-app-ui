import { Outlet, Link } from 'react-router-dom'
import { MessageSquareHeart } from 'lucide-react'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50 via-white to-white">
      <header className="border-b border-neutral-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-neutral-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
              <MessageSquareHeart className="h-5 w-5" />
            </span>
            Ryan Feedback Board
          </Link>
          <Link
            to="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-ring"
          >
            Admin Login
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl">
          <Outlet />
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-neutral-400">
        Made with care — your feedback helps us improve.
      </footer>
    </div>
  )
}

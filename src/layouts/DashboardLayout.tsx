import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, LogOut, MessageSquareHeart } from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/feedbacks', label: 'Feedbacks', icon: ListChecks, end: false },
]

export function DashboardLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success('You have been logged out')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar / Navbar - always full size on every screen */}
        <aside className="flex w-full flex-col border-b border-neutral-200 bg-white p-5 lg:h-screen lg:w-64 lg:flex-shrink-0 lg:border-b-0 lg:border-r lg:sticky lg:top-0">
          <div className="mb-6 flex items-center gap-2 font-semibold text-neutral-700 lg:mb-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
              <MessageSquareHeart className="h-5 w-5" />
            </span>
            Ryan Feedback Board
          </div>

          <nav
            className="flex flex-col gap-1 lg:flex-1"
            aria-label="Dashboard navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 lg:mt-0">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

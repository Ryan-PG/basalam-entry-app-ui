import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border bg-white px-3.5 pr-9 text-sm text-neutral-700 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-1 focus:ring-offset-white',
            error
              ? 'border-danger-600 focus:ring-danger-100'
              : 'border-neutral-200 hover:border-neutral-300',
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      </div>
    )
  }
)
Select.displayName = 'Select'

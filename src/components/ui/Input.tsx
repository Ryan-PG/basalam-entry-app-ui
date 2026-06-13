import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-neutral-700 placeholder:text-neutral-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-1 focus:ring-offset-white',
          error
            ? 'border-danger-600 focus:ring-danger-100'
            : 'border-neutral-200 hover:border-neutral-300',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

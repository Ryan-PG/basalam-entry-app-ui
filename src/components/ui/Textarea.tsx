import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'min-h-[120px] w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 transition-colors resize-y',
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
Textarea.displayName = 'Textarea'

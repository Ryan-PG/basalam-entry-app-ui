import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { FeedbackStatus } from '@/types/api'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'warning' | 'success' | 'brand'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  warning: 'bg-warning-100 text-warning-700',
  success: 'bg-success-100 text-success-700',
  brand: 'bg-brand-100 text-brand-700',
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

const statusLabels: Record<FeedbackStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  resolved: 'Resolved',
}

const statusVariants: Record<FeedbackStatus, BadgeProps['variant']> = {
  submitted: 'neutral',
  under_review: 'warning',
  resolved: 'success',
}

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <Badge variant={statusVariants[status]}>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'submitted' && 'bg-neutral-400',
          status === 'under_review' && 'bg-warning-600',
          status === 'resolved' && 'bg-success-600'
        )}
      />
      {statusLabels[status]}
    </Badge>
  )
}

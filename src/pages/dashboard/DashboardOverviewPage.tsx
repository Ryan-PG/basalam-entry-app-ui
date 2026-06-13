import { useQueries } from '@tanstack/react-query'
import { ClipboardList, Clock, Inbox, CheckCircle2 } from 'lucide-react'
import { feedbackService } from '@/services/feedback.service'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton, ErrorState } from '@/components/ui/States'
import { FeedbackListPage } from '@/pages/dashboard/FeedbackListPage'
import type { FeedbackStatus } from '@/types/api'

const STATUS_CONFIG: {
  key: FeedbackStatus | 'total'
  label: string
  icon: typeof Inbox
  iconClass: string
}[] = [
  { key: 'total', label: 'Total Feedbacks', icon: ClipboardList, iconClass: 'bg-brand-100 text-brand-700' },
  { key: 'submitted', label: 'Submitted', icon: Inbox, iconClass: 'bg-neutral-100 text-neutral-600' },
  { key: 'under_review', label: 'Under Review', icon: Clock, iconClass: 'bg-warning-100 text-warning-700' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, iconClass: 'bg-success-100 text-success-700' },
]

// The list endpoint doesn't return a total count, so we fetch a large page
// per status (capped at the max page size of 100) to derive counts.
export function DashboardOverviewPage() {
  const results = useQueries({
    queries: (['submitted', 'under_review', 'resolved'] as FeedbackStatus[]).map(
      (status) => ({
        queryKey: ['feedbacks', 'stats', status],
        queryFn: () => feedbackService.list({ page: 1, size: 100, status }),
      })
    ),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  const counts: Record<FeedbackStatus, number> = {
    submitted: results[0].data?.length ?? 0,
    under_review: results[1].data?.length ?? 0,
    resolved: results[2].data?.length ?? 0,
  }
  const total = counts.submitted + counts.under_review + counts.resolved

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Overview</h1>
        <p className="mt-1 text-sm text-neutral-400">
          A quick snapshot of the feedback your users have submitted.
        </p>
      </div>

      {isError ? (
        <ErrorState
          description="We couldn't load your feedback statistics."
          onRetry={() => results.forEach((r) => r.refetch())}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_CONFIG.map((item) => {
            const value = item.key === 'total' ? total : counts[item.key]
            return (
              <Card key={item.key}>
                <CardContent className="flex items-center gap-4 py-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">{item.label}</p>
                    {isLoading ? (
                      <Skeleton className="mt-1 h-7 w-12" />
                    ) : (
                      <p className="text-2xl font-semibold text-neutral-800">{value}{value === 100 ? '+' : ''}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <FeedbackListPage />
    </div>
  )
}

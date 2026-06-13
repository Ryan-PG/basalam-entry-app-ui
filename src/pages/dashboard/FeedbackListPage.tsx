import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye } from 'lucide-react'
import { useFeedbacksQuery, useUpdateFeedbackMutation } from '@/hooks/useFeedbacks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { formatDate } from '@/lib/utils'
import { parseApiError } from '@/api/client'
import type { FeedbackStatus } from '@/types/api'

const PAGE_SIZE = 10

// Tailwind dynamic styling configuration based on status values
const STATUS_STYLES: Record<FeedbackStatus, string> = {
  submitted: 'bg-neutral-50 text-neutral-700 border-neutral-200 focus:ring-neutral-500',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500',
}

export function FeedbackListPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<FeedbackStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error, isFetching, refetch } = useFeedbacksQuery({
    page,
    size: PAGE_SIZE,
    status: status === 'all' ? null : status,
  })

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateFeedbackMutation()
  
  const filtered = useMemo(() => {
    if (!data) return []
    const term = search.trim().toLowerCase()
    if (!term) return data
    return data.filter(
      (f) =>
        f.title.toLowerCase().includes(term) ||
        f.message.toLowerCase().includes(term)
    )
  }, [data, search])

  function handleStatusFilterChange(value: string) {
    setStatus(value as FeedbackStatus | 'all')
    setPage(1)
  }

  function handleInlineStatusChange(feedbackId: string, newStatus: FeedbackStatus) {
    updateStatus({ id: feedbackId, status: newStatus }, {
      onSuccess: () => {
        refetch() 
      },
      onError: (err) => {
        alert(`Failed to update status: ${parseApiError(err).message}`)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800">Feedbacks</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Browse, search, and manage all feedback submissions.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>All submissions</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search title or message…"
                className="pl-9 sm:w-56"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search feedbacks"
              />
            </div>
            <Select
              value={status}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              aria-label="Filter by status"
              className="sm:w-44"
            >
              <option value="all">All statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="resolved">Resolved</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={6} cols={4} />
          ) : isError ? (
            <ErrorState
              description={parseApiError(error).message}
              onRetry={() => refetch()}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No feedback found"
              description={
                search
                  ? 'Try adjusting your search or filters.'
                  : 'There is no feedback matching this filter yet.'
              }
            />
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Created</TableHeaderCell>
                    <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="max-w-xs">
                        <p className="truncate font-medium text-neutral-800">
                          {feedback.title}
                        </p>
                        <p className="truncate text-xs text-neutral-400">
                          {feedback.message}
                        </p>
                      </TableCell>
                      
                      <TableCell>
                        <Select
                          value={feedback.status}
                          disabled={isUpdating}
                          onChange={(e) => 
                            handleInlineStatusChange(feedback.id, e.target.value as FeedbackStatus)
                          }
                          aria-label="Change status"
                          // Appends dynamic context classes cleanly onto the layout class properties
                          className={`w-36 text-xs font-semibold py-1 h-8 rounded-full border transition-all cursor-pointer ${STATUS_STYLES[feedback.status] || ''}`}
                        >
                          <option value="submitted" className="bg-white text-neutral-800 font-normal">Submitted</option>
                          <option value="under_review" className="bg-white text-neutral-800 font-normal">Under Review</option>
                          <option value="resolved" className="bg-white text-neutral-800 font-normal">Resolved</option>
                        </Select>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-neutral-500">
                        {formatDate(feedback.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/dashboard/feedbacks/${feedback.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 focus-ring"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                page={page}
                hasNextPage={(data?.length ?? 0) === PAGE_SIZE}
                onPageChange={setPage}
                isLoading={isFetching}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
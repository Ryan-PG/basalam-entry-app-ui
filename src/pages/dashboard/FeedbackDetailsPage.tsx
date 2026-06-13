import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFeedbackQuery, useUpdateFeedbackStatusMutation } from '@/hooks/useFeedbacks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Loader, ErrorState } from '@/components/ui/States'
import { formatDate } from '@/lib/utils'
import { parseApiError } from '@/api/client'
import type { FeedbackStatus } from '@/types/api'

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
]

export function FeedbackDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch } = useFeedbackQuery(id)
  const updateStatus = useUpdateFeedbackStatusMutation(id ?? '')

  const [pendingStatus, setPendingStatus] = useState<FeedbackStatus | null>(null)

  if (isLoading) {
    return <Loader label="Loading feedback…" />
  }

  if (isError || !data) {
    return (
      <ErrorState
        description={error ? parseApiError(error).message : 'Feedback not found.'}
        onRetry={() => refetch()}
      />
    )
  }

  function handleConfirmStatusChange() {
    if (!pendingStatus) return
    updateStatus.mutate(
      { status: pendingStatus },
      {
        onSuccess: () => {
          toast.success('Status updated successfully')
          setPendingStatus(null)
        },
        onError: (err) => {
          toast.error(parseApiError(err).message)
          setPendingStatus(null)
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/dashboard/feedbacks"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feedbacks
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">{data.title}</CardTitle>
            <p className="mt-1 text-xs text-neutral-400">
              Submitted {formatDate(data.created_at)} · Last updated{' '}
              {formatDate(data.updated_at)}
            </p>
          </div>
          <StatusBadge status={data.status} />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-700">Message</h3>
            <p className="whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
              {data.message}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <h3 className="mb-1 text-sm font-semibold text-neutral-700">
              Update status
            </h3>
            <p className="mb-3 text-xs text-neutral-400">
              Changing the status notifies the team and updates this
              feedback's record.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={data.status}
                onChange={(e) => setPendingStatus(e.target.value as FeedbackStatus)}
                aria-label="Update feedback status"
                className="sm:w-56"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={!!pendingStatus && pendingStatus !== data.status}
        onClose={() => setPendingStatus(null)}
        title="Confirm status change"
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              isLoading={updateStatus.isPending}
            >
              <RefreshCw className="h-4 w-4" />
              Confirm
            </Button>
          </>
        }
      >
        Are you sure you want to change the status from{' '}
        <span className="font-medium capitalize">
          {data.status.replace('_', ' ')}
        </span>{' '}
        to{' '}
        <span className="font-medium capitalize">
          {pendingStatus?.replace('_', ' ')}
        </span>
        ?
      </Modal>
    </div>
  )
}

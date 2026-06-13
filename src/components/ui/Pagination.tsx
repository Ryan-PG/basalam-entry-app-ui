import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface PaginationProps {
  page: number
  hasNextPage: boolean
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function Pagination({
  page,
  hasNextPage,
  onPageChange,
  isLoading,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-1">
      <p className="text-sm text-neutral-500">Page {page}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage || isLoading}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

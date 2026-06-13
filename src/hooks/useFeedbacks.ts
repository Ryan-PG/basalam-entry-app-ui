import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedbackService } from '@/services/feedback.service'
import type {
  FeedbackCreate,
  FeedbackUpdateStatus,
  ListFeedbacksParams,
} from '@/types/api'

export const feedbackKeys = {
  all: ['feedbacks'] as const,
  list: (params: ListFeedbacksParams) => ['feedbacks', 'list', params] as const,
  detail: (id: string) => ['feedbacks', 'detail', id] as const,
}

export function useFeedbacksQuery(params: ListFeedbacksParams) {
  return useQuery({
    queryKey: feedbackKeys.list(params),
    queryFn: () => feedbackService.list(params),
    placeholderData: (prev) => prev,
  })
}

export function useFeedbackQuery(id: string | undefined) {
  return useQuery({
    queryKey: feedbackKeys.detail(id ?? ''),
    queryFn: () => feedbackService.getById(id as string),
    enabled: !!id,
  })
}

export function useSubmitFeedbackMutation() {
  return useMutation({
    mutationFn: (payload: FeedbackCreate) => feedbackService.submit(payload),
  })
}

export function useUpdateFeedbackStatusMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: FeedbackUpdateStatus) =>
      feedbackService.updateStatus(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(feedbackKeys.detail(id), data)
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all })
    },
  })
}

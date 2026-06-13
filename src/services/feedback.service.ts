import { apiClient } from '@/api/client'
import type {
  FeedbackCreate,
  FeedbackResponse,
  FeedbackUpdateStatus,
  ListFeedbacksParams,
} from '@/types/api'

export const feedbackService = {
  submit: async (payload: FeedbackCreate): Promise<FeedbackResponse> => {
    const { data } = await apiClient.post<FeedbackResponse>(
      '/feedbacks',
      payload
    )
    return data
  },

  list: async (params: ListFeedbacksParams): Promise<FeedbackResponse[]> => {
    const { data } = await apiClient.get<FeedbackResponse[]>('/feedbacks', {
      params: {
        page: params.page,
        size: params.size,
        status: params.status ?? undefined,
      },
    })
    return data
  },

  getById: async (id: string): Promise<FeedbackResponse> => {
    const { data } = await apiClient.get<FeedbackResponse>(
      `/feedbacks/${id}`
    )
    return data
  },

  updateStatus: async (
    id: string,
    payload: FeedbackUpdateStatus
  ): Promise<FeedbackResponse> => {
    const { data } = await apiClient.patch<FeedbackResponse>(
      `/feedbacks/${id}/status`,
      payload
    )
    return data
  },
}

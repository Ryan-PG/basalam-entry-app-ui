import { apiClient } from '@/api/client'
import type { AdminCreate, AdminLogin, AdminResponse, Token } from '@/types/api'

export const authService = {
  register: async (payload: AdminCreate): Promise<AdminResponse> => {
    const { data } = await apiClient.post<AdminResponse>(
      '/auth/register',
      payload
    )
    return data
  },

  login: async (payload: AdminLogin): Promise<Token> => {
    const { data } = await apiClient.post<Token>('/auth/login', payload)
    return data
  },
}

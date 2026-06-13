import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import type { AdminLogin } from '@/types/api'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: AdminLogin) => authService.login(payload),
  })
}

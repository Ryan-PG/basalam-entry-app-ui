import axios, { type AxiosError } from 'axios'
import { tokenStorage } from '@/lib/token'

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Authorization header automatically
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// A simple event so the auth context can react to 401s globally
export const AUTH_LOGOUT_EVENT = 'auth:logout'

// Response interceptor: global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
    }
    return Promise.reject(error)
  }
)

export interface ApiErrorShape {
  message: string
  fieldErrors?: Record<string, string>
}

/**
 * Normalizes Axios / FastAPI validation errors into a friendly shape.
 */
export function parseApiError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as
      | { detail?: unknown }
      | undefined

    if (!error.response) {
      return {
        message:
          'Network error. Please check your connection and try again.',
      }
    }

    if (status === 422 && data?.detail && Array.isArray(data.detail)) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of data.detail as Array<{
        loc: (string | number)[]
        msg: string
      }>) {
        const field = issue.loc?.[issue.loc.length - 1]
        if (field) fieldErrors[String(field)] = issue.msg
      }
      return {
        message: 'Please correct the highlighted fields and try again.',
        fieldErrors,
      }
    }

    if (status === 401) {
      return { message: 'Invalid credentials or session expired.' }
    }

    if (status === 404) {
      return { message: 'The requested resource was not found.' }
    }

    if (typeof data?.detail === 'string') {
      return { message: data.detail }
    }

    if (status && status >= 500) {
      return { message: 'Something went wrong on the server. Please try again later.' }
    }

    return { message: error.message || 'An unexpected error occurred.' }
  }

  return { message: 'An unexpected error occurred.' }
}

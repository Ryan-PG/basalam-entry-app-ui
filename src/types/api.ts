// Types derived directly from the provided OpenAPI/Swagger specification.

export type FeedbackStatus = 'submitted' | 'under_review' | 'resolved'

export const FEEDBACK_STATUSES: FeedbackStatus[] = [
  'submitted',
  'under_review',
  'resolved',
]

export interface AdminCreate {
  username: string
  email: string
  password: string
}

export interface AdminLogin {
  email: string
  password: string
}

export interface AdminResponse {
  id: string
  username: string
  email: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface FeedbackCreate {
  title: string
  message: string
}

export interface FeedbackResponse {
  id: string
  title: string
  message: string
  status: FeedbackStatus
  created_at: string
  updated_at: string
}

export interface FeedbackUpdateStatus {
  status: FeedbackStatus
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
  input?: unknown
  ctx?: Record<string, unknown>
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface ListFeedbacksParams {
  page?: number
  size?: number
  status?: FeedbackStatus | null
}

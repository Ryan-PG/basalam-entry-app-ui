import { z } from 'zod'

// Mirrors FeedbackCreate: title (3-200 chars), message (5-5000 chars)
export const feedbackSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters'),
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(5000, 'Message must be at most 5000 characters'),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>

// Mirrors AdminLogin
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// Mirrors FeedbackUpdateStatus
export const updateStatusSchema = z.object({
  status: z.enum(['submitted', 'under_review', 'resolved']),
})

export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Send } from 'lucide-react'
import { feedbackSchema, type FeedbackFormValues } from '@/lib/validation'
import { useSubmitFeedbackMutation } from '@/hooks/useFeedbacks'
import { parseApiError } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Label, FieldError } from '@/components/ui/Label'
import toast from 'react-hot-toast'

export function FeedbackSubmissionPage() {
  const mutation = useSubmitFeedbackMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { title: '', message: '' },
  })

  const onSubmit = (values: FeedbackFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success('Thanks! Your feedback has been submitted.')
        reset()
      },
      onError: (error) => {
        const parsed = parseApiError(error)
        if (parsed.fieldErrors) {
          for (const [field, message] of Object.entries(parsed.fieldErrors)) {
            if (field === 'title' || field === 'message') {
              setError(field, { message })
            }
          }
        }
        toast.error(parsed.message)
      },
    })
  }

  if (mutation.isSuccess) {
    return (
      <Card className="text-center">
        <CardContent className="flex flex-col items-center gap-3 py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-700">
            Feedback submitted!
          </h2>
          <p className="max-w-sm text-sm text-neutral-400">
            Thank you for taking the time to share your thoughts. Our team
            will review it shortly.
          </p>
          <Button onClick={() => mutation.reset()} variant="secondary" className="mt-2">
            Submit another response
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Share your feedback</CardTitle>
        <p className="mt-1 text-sm text-neutral-400">
          We'd love to hear your thoughts, suggestions, or issues. No account
          needed.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="A short summary of your feedback"
              error={errors.title?.message}
              {...register('title')}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your experience…"
              error={errors.message?.message}
              {...register('message')}
            />
            <FieldError message={errors.message?.message} />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={mutation.isPending}
          >
            <Send className="h-4 w-4" />
            Submit feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

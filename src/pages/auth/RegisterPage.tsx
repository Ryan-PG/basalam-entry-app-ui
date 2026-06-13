import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { parseApiError } from '@/api/client'
import { useAuth } from '@/store/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label, FieldError } from '@/components/ui/Label'
import toast from 'react-hot-toast'

// Mirrors AdminCreate: username (3-50 chars), email, password (min 8 chars)
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: authService.register,
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success('Account created! You can now sign in.')
        navigate('/login', { replace: true })
      },
      onError: (error) => {
        const parsed = parseApiError(error)
        if (parsed.fieldErrors) {
          for (const [field, message] of Object.entries(parsed.fieldErrors)) {
            if (field === 'username' || field === 'email' || field === 'password') {
              setError(field, { message })
            }
          }
        }
        toast.error(parsed.message)
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create an admin account</CardTitle>
        <p className="mt-1 text-sm text-neutral-400">
          Register to manage and review submitted feedback.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              placeholder="janedoe"
              error={errors.username?.message}
              {...register('username')}
            />
            <FieldError message={errors.username?.message} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            <UserPlus className="h-4 w-4" />
            Create account
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

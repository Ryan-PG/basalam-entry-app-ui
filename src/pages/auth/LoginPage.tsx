import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '@/lib/validation'
import { useLoginMutation } from '@/hooks/useAuthMutations'
import { parseApiError } from '@/api/client'
import { useAuth } from '@/store/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label, FieldError } from '@/components/ui/Label'
import toast from 'react-hot-toast'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const mutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        login(data.access_token)
        toast.success('Welcome back!')
        navigate('/dashboard', { replace: true })
      },
      onError: (error) => {
        const parsed = parseApiError(error)
        if (parsed.fieldErrors) {
          for (const [field, message] of Object.entries(parsed.fieldErrors)) {
            if (field === 'email' || field === 'password') {
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
        <CardTitle className="text-xl">Admin Login</CardTitle>
        <p className="mt-1 text-sm text-neutral-400">
          Sign in to manage and review submitted feedback.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

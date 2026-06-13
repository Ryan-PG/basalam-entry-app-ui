import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-50 px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger-600">
            <AlertOctagon className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-semibold text-neutral-700">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-neutral-400">
            An unexpected error occurred while rendering this page. Please
            refresh and try again.
          </p>
          <Button onClick={() => window.location.assign('/')}>
            Go to homepage
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

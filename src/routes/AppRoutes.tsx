import { Routes, Route } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { FeedbackSubmissionPage } from '@/pages/public/FeedbackSubmissionPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardOverviewPage } from '@/pages/dashboard/DashboardOverviewPage'
import { FeedbackListPage } from '@/pages/dashboard/FeedbackListPage'
import { FeedbackDetailsPage } from '@/pages/dashboard/FeedbackDetailsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<FeedbackSubmissionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverviewPage />} />
          <Route path="/dashboard/feedbacks" element={<FeedbackListPage />} />
          <Route path="/dashboard/feedbacks/:id" element={<FeedbackDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

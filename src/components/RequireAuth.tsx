import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

/** Wraps every page that needs a signed-in user. Signed-out visitors are sent to the Login page. */
export default function RequireAuth() {
  const { session, loading } = useAuth()

  // Wait for the saved-session check, otherwise a signed-in person would flash the Login page on every refresh.
  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-[linear-gradient(150deg,#D3E3F8_0%,#E2E1F6_52%,#DDEEEA_100%)] font-sans text-sm font-semibold text-muted"
      >
        Loading…
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

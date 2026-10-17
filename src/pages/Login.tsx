import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import SlateMark from '../components/SlateMark'
import { useAuth } from '../lib/authContext'

/** Whether the text looks like an email address (something, an @, something, a dot, something). */
function looksLikeEmail(text: string): boolean {
  return /^\S+@\S+\.\S+$/.test(text)
}

/**
 * The sign-in screen. Restyled from design/Login.dc.html to match the desktop pages.
 * Signs in with Supabase (email and password). The session is kept on this device, so you stay signed in.
 */
export default function Login() {
  const navigate = useNavigate()
  const { session, signIn } = useAuth()
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [showReset, setShowReset] = useState(false)

  // Already signed in (for example a saved session on this device): go straight to the Dashboard.
  if (session) return <Navigate to="/" replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    const problems: string[] = []
    if (!email.trim()) problems.push('Enter your email address.')
    else if (!looksLikeEmail(email.trim())) problems.push('That email address does not look right.')
    if (!password) problems.push('Enter your password.')
    setErrors(problems)
    if (problems.length > 0) return

    setBusy(true)
    const failure = await signIn(email.trim(), password)
    setBusy(false)
    if (failure) {
      setErrors([failure])
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="box-border flex min-h-screen items-center justify-center bg-[linear-gradient(150deg,#D3E3F8_0%,#E2E1F6_52%,#DDEEEA_100%)] p-6 font-sans text-ink">
      <form
        onSubmit={submit}
        noValidate
        className="white box-border flex w-full max-w-[440px] flex-col gap-[18px] rounded-[34px] px-[34px] py-8"
      >
        <div className="flex items-center gap-3">
          <SlateMark size={46} />
          <span className="flex flex-col leading-[1.1]">
            <span className="text-2xl font-extrabold tracking-[-0.02em]">Slate</span>
            <span className="mt-[3px] text-[11px] font-semibold text-muted">Work and performance</span>
          </span>
        </div>

        <div>
          <h1 className="m-0 text-[25px] font-extrabold tracking-[-0.01em]">Sign in</h1>
          <p className="mb-0 mt-2 text-sm leading-[1.6] text-muted">
            This is a private portal. Only your account can open your tasks.
          </p>
        </div>

        {errors.length > 0 && (
          <div
            role="alert"
            className="flex flex-col gap-1.5 rounded-[18px] bg-red-pastel px-[18px] py-4 text-[13.5px] font-semibold leading-[1.5] text-red-dark"
          >
            {errors.map((message) => (
              <span key={message}>{message}</span>
            ))}
          </div>
        )}

        <label className="lbl">
          Email
          <input
            className="fld"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="lbl">
          Password
          <input
            className="fld"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit" className="pillbtn dark h-[54px] text-[15px]" disabled={busy} aria-busy={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            className="min-h-11 cursor-pointer border-0 bg-transparent font-sans text-[13px] font-semibold text-navy"
            onClick={() => setShowReset(true)}
          >
            Forgot password
          </button>
          {showReset && (
            <p role="status" className="m-0 text-center text-xs leading-[1.55] text-muted">
              Reset by email is not set up yet. To change your password, open your Supabase project, go to Authentication,
              then Users, and reset it there.
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

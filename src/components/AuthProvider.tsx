import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthContext } from '../lib/authContext'
import { clearCache } from '../lib/taskCache'
import type { AuthState } from '../lib/authContext'
import { supabase } from '../lib/supabase'

/** Turns a Supabase sign-in error into a plain message. It never says whether the email exists. */
function signInMessage(error: { code?: string; status?: number; name?: string }): string {
  if (error.code === 'invalid_credentials') return 'That email or password is not right.'
  if (error.status === 429 || error.code === 'over_request_rate_limit') {
    return 'Too many attempts. Wait a minute and try again.'
  }
  if (error.name === 'AuthRetryableFetchError') return 'Could not reach the server. Check your internet connection.'
  return 'Could not sign in. Try again in a moment.'
}

/**
 * Keeps track of who is signed in. Supabase saves the session in this browser (localStorage), so you stay signed in on
 * this device after closing the tab, and it renews the session by itself. Wrap the whole app in this.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    // First look for a session saved on this device, then follow every later sign-in, sign-out and renewal.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setSession(data.session)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      // The saved copy of the tasks is private: remove it whenever the user is signed out, however that happened.
      if (event === 'SIGNED_OUT') clearCache()
      setSession(next)
      setLoading(false)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      session,
      loading,
      async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return signInMessage(error)
        // Set it right away so the guard lets the next page through without waiting for the change event.
        setSession(data.session)
        return null
      },
      async signOut() {
        clearCache()
        await supabase.auth.signOut()
        setSession(null)
      },
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

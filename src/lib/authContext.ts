import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthState = {
  /** The signed-in session, or null when signed out. */
  session: Session | null
  /** True until the first check for a saved session on this device has finished. */
  loading: boolean
  /** Signs in with email and password. Resolves to null on success, or a message that is safe to show on screen. */
  signIn: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

/** The current sign-in state. Must be used under `AuthProvider`. */
export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

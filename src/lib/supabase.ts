import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// A missing setting is a set-up mistake (no .env locally, or no GitHub secret for the deploy). Say so loudly instead of
// letting every request fail with a confusing message later.
if (!url || !anonKey) {
  throw new Error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (see .env.example), ' +
      'and as GitHub Actions secrets for the deploy.',
  )
}

/**
 * The one shared Supabase connection. It uses only the public (anon / publishable) key, which is safe in the browser
 * because Row Level Security limits every row to the signed-in user. Never put the service-role key anywhere in this app.
 */
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // The app uses HashRouter, so "#/..." in the address is a page, not a Supabase sign-in link. Password sign-in does not need it.
    detectSessionInUrl: false,
  },
})

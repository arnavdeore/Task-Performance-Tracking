/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Project URL, e.g. https://abcdxyz.supabase.co (Supabase dashboard > Project Settings > API). */
  readonly VITE_SUPABASE_URL: string
  /** The public anon / publishable key. Never the service-role or secret key. */
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

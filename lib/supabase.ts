/**
 * Supabase client configured with the Service Role key.
 *
 * This client is intended for **server-side use only** as it uses the
 * Supabase Service Role key, which has elevated privileges and bypasses
 * Row-Level Security (RLS).
 *
 * ⚠️ Do NOT import this in any client-side code or expose the service key.
 *
 * Usage:
 * - Server-side authentication hooks (e.g. NextAuth callbacks)
 * - Admin-level database operations
 */

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

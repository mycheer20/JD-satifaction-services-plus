import "server-only";

import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Service-role client. It bypasses row level security entirely, so callers must
 * have already established that the current user is allowed to perform the
 * operation — see `requireAdmin()` in `features/auth/guards.ts`.
 */
export function createSupabaseAdminClient() {
  return createClient<Database>(
    serverEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

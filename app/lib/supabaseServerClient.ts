// lib/supabaseServerClient.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function createClient() {
  // This uses the incoming request cookies to build a server Supabase client
  // (works with Next.js App Router server components).
  return createServerComponentClient({ cookies });
}

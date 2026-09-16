import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = url && anon ? createClient(url, anon) : (null as any);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = url && service ? createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
}) : (null as any);

export type TrumaSession = {
  id: string;
  session_date: string;
  subject: string;
  mode: string;
  score: number;
  total: number;
  xp_earned: number;
  stars_earned: number;
  topics_covered: string[];
  created_at: string;
};

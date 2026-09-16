import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { TrumaSession } from "@/lib/supabase";
import ParentDashboard from "@/components/ParentDashboard";

export const metadata: Metadata = { title: "Parent Dashboard | Schoolhouse" };

export default async function ParentPage() {
  const cookieStore = await cookies();
  const parentPin = cookieStore.get("ta-parent")?.value;
  if (process.env.PARENT_AUTH_ENFORCE !== "0" && parentPin !== process.env.PARENT_PIN) {
    redirect("/?mode=parent");
  }

  const sessions: TrumaSession[] = [];
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("truma_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    sessions.push(...((data ?? []) as TrumaSession[]));
  }

  return <ParentDashboard sessions={sessions} />;
}

import type { Metadata } from "next";
import { isParent } from "@/lib/parent-auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { TrumaSession } from "@/lib/supabase";
import ParentDashboard from "@/components/ParentDashboard";
import ParentDeskBar from "@/components/ParentDeskBar";

export const metadata: Metadata = { title: "Mom desk | Schoolhouse" };

export default async function ParentPage() {
  if (!(await isParent())) {
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

  return (
    <>
      <ParentDeskBar />
      <ParentDashboard sessions={sessions} />
    </>
  );
}

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WordListEditor from "@/components/WordListEditor";

export const metadata: Metadata = { title: "This week | Schoolhouse" };

export default async function WordsPage() {
  const cookieStore = await cookies();
  const parentPin = cookieStore.get("ta-parent")?.value;
  if (process.env.PARENT_AUTH_ENFORCE !== "0" && parentPin !== process.env.PARENT_PIN) {
    redirect("/?mode=parent");
  }
  return (
    <>
      <div style={{ background: "#f5f0e6", padding: "16px 16px 0" }}>
        <div style={{ maxWidth: 672, margin: "0 auto" }}>
          <a
            href="/parent/map?kid=titus"
            style={{ display: "block", textAlign: "center", borderRadius: 999, padding: "12px 16px", background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: 14, textDecoration: "none" }}
          >
            Texas map · Practice on this phone
          </a>
        </div>
      </div>
      <WordListEditor />
    </>
  );
}

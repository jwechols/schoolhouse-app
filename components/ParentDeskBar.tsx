"use client";

export default function ParentDeskBar() {
  const links = [
    ["/parent", "Assign"],
    ["/teacher/room", "Who is on"],
    ["/parent/words", "Words"],
    ["/parent/curriculum", "Lessons"],
    ["/parent/reading", "Reading"],
    ["/plan", "Today"],
  ] as const;
  return (
    <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 16px", background: "#f7f3ea", borderBottom: "1px solid #dbd8cf" }}>
      {links.map(([href, label]) => (
        <a key={href} href={href} style={{ padding: "8px 12px", borderRadius: 999, background: "#fff", border: "1px solid #dbd8cf", textDecoration: "none", color: "#2c1f0e", fontSize: 13, fontWeight: 700 }}>
          {label}
        </a>
      ))}
    </nav>
  );
}

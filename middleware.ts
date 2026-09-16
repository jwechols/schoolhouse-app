import { NextRequest, NextResponse } from "next/server";

const STUDENT_COOKIE = "ta-student";
const PARENT_COOKIE = "ta-parent";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // /teacher is where the parent PIN screen (FamilyLanding) actually sends you,
  // and it renders the Teacher Station with parent-level info. It must be gated
  // the same as /parent, not just the PIN prompt in front of it.
  if (pathname.startsWith("/parent") || pathname.startsWith("/teacher")) {
    if (process.env.PARENT_AUTH_ENFORCE === "0") return NextResponse.next();
    const parentPin = req.cookies.get(PARENT_COOKIE)?.value;
    if (parentPin !== process.env.PARENT_PIN) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Family kid routes are open — no PIN required
  if (pathname.startsWith("/kids/")) {
    return NextResponse.next();
  }

  // All other routes (Truma's hub, etc.) — open, no PIN required
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

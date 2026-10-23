import { NextRequest, NextResponse } from "next/server";
import { PARENT_COOKIE, parentPinOk } from "@/lib/parent-auth";

export async function middleware(req: NextRequest) {
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
    if (!(await parentPinOk(req.cookies.get(PARENT_COOKIE)?.value, process.env))) {
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

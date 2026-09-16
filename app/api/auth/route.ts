import { NextRequest, NextResponse } from "next/server";

const STUDENT_COOKIE = "ta-student";
const PARENT_COOKIE = "ta-parent";
const KID_COOKIE = "fa-kid";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

function cookieOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SEVEN_DAYS,
    path: "/",
  };
}

export async function POST(req: NextRequest) {
  const { pin, mode, kidId } = await req.json();

  const isParent = mode === "parent" && pin === process.env.PARENT_PIN;
  const isStudent = mode === "student" && pin === process.env.TRUMA_PIN;

  let isKid = false;
  if (mode === "kid" && kidId) {
    const envKey = `${String(kidId).toUpperCase()}_PIN`;
    const expected = process.env[envKey];
    isKid = !!expected && pin === expected;
  }

  if (!isParent && !isStudent && !isKid) {
    return NextResponse.json({ error: "Wrong PIN" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  if (isParent) {
    res.cookies.set(PARENT_COOKIE, pin, cookieOpts());
  } else if (isStudent) {
    res.cookies.set(STUDENT_COOKIE, pin, cookieOpts());
  } else {
    res.cookies.set(KID_COOKIE, String(kidId), cookieOpts());
  }

  return res;
}

// Lock the kiosk, clears the signed-in kid so the next child must re-enter their PIN.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KID_COOKIE, "", { ...cookieOpts(), maxAge: 0 });
  return res;
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHash) {
    return NextResponse.json(
      { error: "Server is not configured for admin login" },
      { status: 500 }
    );
  }

  const emailOk = email && email.toLowerCase() === adminEmail.toLowerCase();
  const passwordOk = password && bcrypt.compareSync(password, adminHash);

  if (!emailOk || !passwordOk) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = await createSession(adminEmail);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "tb_session";

async function isValid(token) {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// Protect /admin (pages) and /api/posts writes. The login page stays public.
//
// NOTE: Next.js 16 deprecates the `middleware` convention in favor of `proxy`,
// but the `proxy` build path is buggy in 16.2.9 (it fails renaming the compiled
// output during trace collection). Staying on `middleware` until that is fixed.
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await isValid(token);

  // Allow the login page and the auth API through.
  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect admin pages.
  if (pathname.startsWith("/admin")) {
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect write methods on the posts API.
  if (pathname.startsWith("/api/posts")) {
    const method = request.method.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && !valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/posts/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, DEFAULT_ROUTE, isAdmin, type User } from "@/lib/auth";

const PUBLIC_PATHS = new Set<string>(["/login"]);
const PUBLIC_PREFIXES = ["/icon", "/apple-icon", "/manifest"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let user: User;
  try {
    user = JSON.parse(decodeURIComponent(cookie)) as User;
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  if (pathname === "/") {
    const dest = isAdmin(user) ? "/admin/access" : DEFAULT_ROUTE;
    if (dest !== pathname) {
       return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // API sessions: any authenticated route OK; /admin/access permission check is server-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/dev|favicon.ico|.*\\..*).*)",
  ],
};

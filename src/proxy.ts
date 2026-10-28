import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard","/wms","/products","/platforms","/platform","/orders","/settlement","/shipping","/international","/admin","/weight"];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/" || path.startsWith("/login") || path.startsWith("/logout") || path.startsWith("/api/") || path.startsWith("/_next") || path.includes(".")) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some(p => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasAuth = req.cookies.getAll().some(c => c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth");

  if (!hasAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export default proxy;

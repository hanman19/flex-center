import { NextRequest, NextResponse } from "next/server";

const PROTECTED = [
  "/dashboard",
  "/wms",
  "/products",
  "/platforms",
  "/platform",
  "/orders",
  "/settlement",
  "/shipping",
  "/international",
  "/admin",
  "/weight",
  "/operation",
];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 로그인, 홈페이지, 로그아웃, API, 정적 파일은 패스! 절대 안 건드림!
  if (
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/logout") ||
    path.startsWith("/api/") ||
    path.startsWith("/_next") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // 쿠키에 로그인 정보 있는지 확인! 없으면 /login으로!
  const cookies = req.cookies.getAll();
  const hasAuth = cookies.some(
    (c) => c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth"
  );

  if (!hasAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

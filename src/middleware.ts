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

  if (
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/logout") ||
    path.startsWith("/api/") ||
    path.startsWith("/_next") ||
    path.includes(".")
  ) {
    // 로그인 페이지에서 force_logout 있으면 서버 쿠키 삭제!
    if (path.startsWith("/login")) {
      const hasForceLogout = req.cookies.get("force_logout");
      if (hasForceLogout) {
        const res = NextResponse.next();
        // 서버 쿠키 전부 삭제!
        req.cookies.getAll().forEach(c => {
          if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
            res.cookies.set(c.name, "", { maxAge: 0, path: "/" });
          }
        });
        // force_logout은 유지! 홈페이지에서도 로그아웃 상태 유지!
        return res;
      }
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // force_logout 쿠키 있으면 무조건 로그인 안 된 걸로!
  const hasForceLogout = req.cookies.get("force_logout");
  if (hasForceLogout) {
    const loginUrl = new URL("/login?logout=done", req.url);
    const res = NextResponse.redirect(loginUrl);
    // 서버 쿠키 삭제!
    req.cookies.getAll().forEach(c => {
      if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
        res.cookies.set(c.name, "", { maxAge: 0, path: "/" });
      }
    });
    return res;
  }

  const hasAuth = req.cookies.getAll().some(
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

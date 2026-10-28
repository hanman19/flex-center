import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 보호할 경로
const PROTECTED_PATHS = ["/dashboard", "/wms", "/international", "/weight", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호 대상인지 확인
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Supabase auth 쿠키 확인 - sb-로 시작하는 쿠키에 auth-token 포함된 게 있으면 로그인된 것
  const cookies = request.cookies.getAll();
  const hasSupabaseAuth = cookies.some(
    (c) => c.name.includes("sb-") && c.value.includes("access_token")
  );
  
  // 또는 sb-xxx-auth-token 쿠키 자체가 있는지
  const hasAuthCookie = cookies.some((c) => c.name.startsWith("sb-") && c.name.includes("auth"));

  // 로그인 안 됐으면 /login으로!
  if (!hasSupabaseAuth && !hasAuthCookie) {
    // 쿠키가 아예 없거나 비어있으면 로그인 안 된 것
    // 단, sb- 쿠키가 있지만 access_token이 없을 수도 있어서 더 엄격하게: sb 쿠키가 0개면 무조건 /login
    const sbCookies = cookies.filter((c) => c.name.startsWith("sb-"));
    if (sbCookies.length === 0) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // sb 쿠키가 있지만 비어있거나 만료됐을 수도 있으니 길이 체크
    const hasValidSbCookie = sbCookies.some((c) => c.value.length > 100);
    if (!hasValidSbCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/wms/:path*", "/wms-lite/:path*", "/international/:path*", "/weight/:path*", "/admin/:path*"],
};

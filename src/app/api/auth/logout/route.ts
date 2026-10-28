import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Supabase 관련 쿠키 다 지우기!
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes("supabase") || cookie.name.includes("sb-") || cookie.name.includes("auth")) {
      cookieStore.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }

  // 일반적인 쿠키도 지우기!
  cookieStore.set("sb-access-token", "", { maxAge: 0, path: "/" });
  cookieStore.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

  return NextResponse.json({ success: true, message: "로그아웃 - 쿠키 삭제!" });
}

export async function GET() {
  const cookieStore = await cookies();
  
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes("supabase") || cookie.name.includes("sb-") || cookie.name.includes("auth")) {
      cookieStore.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }

  cookieStore.set("sb-access-token", "", { maxAge: 0, path: "/" });
  cookieStore.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

  return NextResponse.redirect(new URL("/", "https://flex-center.vercel.app"));
}

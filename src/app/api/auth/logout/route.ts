import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Supabase 관련 모든 쿠키 삭제!
  for (const c of allCookies) {
    if (
      c.name.includes("supabase") ||
      c.name.startsWith("sb-") ||
      c.name.includes("auth-token") ||
      c.name.includes("access-token") ||
      c.name.includes("refresh-token")
    ) {
      cookieStore.delete(c.name);
      // path 명시해서 한번 더 삭제!
      try {
        cookieStore.set(c.name, "", { maxAge: 0, path: "/" });
      } catch {}
    }
  }

  // flex-auth 쿠키도 삭제!
  cookieStore.delete("flex-auth");
  try {
    cookieStore.set("flex-auth", "", { maxAge: 0, path: "/" });
  } catch {}

  return NextResponse.json({ success: true, message: "Logged out" });
}

export async function GET() {
  return POST();
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  
  // 모든 Supabase + flex-auth 쿠키 삭제! 속성까지 맞춰서!
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
      cookieStore.set({
        name: c.name,
        value: "",
        maxAge: 0,
        path: "/",
      });
      try {
        cookieStore.delete(c.name);
      } catch {}
    }
  }
  
  // 혹시 모르는 쿠키도 한번 더!
  const res = NextResponse.json({ ok: true, cleared: all.length });
  res.cookies.set("flex-auth", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token-code-verifier", "", { maxAge: 0, path: "/" });
  
  return res;
}

export async function GET() {
  return POST();
}

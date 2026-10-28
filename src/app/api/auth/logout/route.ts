import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  
  // 모든 인증 쿠키 삭제!
  const toDelete = [
    "flex-auth",
    "force_logout",
    "sb-qkpnvfmsmvcemdblaahl-auth-token",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.0",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.1",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.2",
    "sb-qkpnvfmsmvcemdblaahl-auth-token-code-verifier",
  ];

  for (const name of toDelete) {
    try { cookieStore.delete(name); } catch {}
    try { cookieStore.set(name, "", { maxAge: 0, path: "/" }); } catch {}
  }

  // 발견된 sb- 쿠키도 전부 삭제!
  const all = cookieStore.getAll();
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth" || c.name === "force_logout") {
      try { cookieStore.set(c.name, "", { maxAge: 0, path: "/" }); } catch {}
      try { cookieStore.delete(c.name); } catch {}
    }
  }

  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/login", url.origin));
  
  // 리다이렉트 응답에도 삭제 쿠키 설정!
  for (const name of toDelete) {
    res.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  res.cookies.set("force_logout", "", { maxAge: 0, path: "/" });
  
  return res;
}

export async function POST() {
  return GET(new Request("https://dummy.com"));
}

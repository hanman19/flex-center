import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.json({ ok: true, deleted: true });

  // 모든 쿠키 삭제! redirect 없이 JSON으로!
  const all = req.cookies.getAll();
  
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth" || c.name === "logged_out") {
      res.cookies.delete(c.name);
      res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/" });
      res.cookies.set({ name: c.name, value: "", expires: new Date(0), path: "/" });
    }
  }

  // 알려진 이름 전부!
  const names = [
    "flex-auth",
    "logged_out",
    "sb-qkpnvfmsmvcemdblaahl-auth-token",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.0",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.1",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.2",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.3",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.4",
    "sb-qkpnvfmsmvcemdblaahl-auth-token-code-verifier",
  ];

  for (const name of names) {
    res.cookies.delete(name);
    res.cookies.set({ name, value: "", maxAge: 0, path: "/" });
    res.cookies.set({ name, value: "", expires: new Date(0), path: "/" });
    res.cookies.set({ name, value: "", maxAge: 0, path: "/", domain: ".vercel.app" });
    res.cookies.set({ name, value: "", maxAge: 0, path: "/", domain: "flex-center.vercel.app" });
  }

  // 로그아웃 플래그는 1로 설정!
  res.cookies.set({ name: "logged_out", value: "1", maxAge: 86400, path: "/" });
  res.cookies.set({ name: "logged_out", value: "1", maxAge: 86400, path: "/", sameSite: "lax" as const });

  return res;
}

export async function POST(req: NextRequest) {
  return GET(req);
}

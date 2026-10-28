import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const all = req.cookies.getAll();
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/login", url.origin));

  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth" || c.name === "force_logout") {
      res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/" });
      res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/", httpOnly: true, secure: true, sameSite: "lax" as const });
      res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/", httpOnly: false, secure: false, sameSite: "lax" as const });
    }
  }

  const known = [
    "flex-auth",
    "force_logout",
    "sb-qkpnvfmsmvcemdblaahl-auth-token",
    "sb-qkpnvfmsmvcemdblaahl-auth-token-code-verifier",
  ];
  for (let i = 0; i <= 9; i++) {
    known.push(`sb-qkpnvfmsmvcemdblaahl-auth-token.${i}`);
  }

  for (const name of known) {
    res.cookies.set({ name, value: "", maxAge: 0, path: "/" });
    res.cookies.set({ name, value: "", maxAge: 0, path: "/", httpOnly: true, secure: true, sameSite: "lax" as const });
  }

  return res;
}

export async function POST(req: NextRequest) {
  return GET(req);
}

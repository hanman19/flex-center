import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const all = req.cookies.getAll();
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
      res.cookies.delete(c.name);
      res.cookies.set({ name: c.name, value: "", maxAge: 0, path: "/" });
      res.cookies.set({ name: c.name, value: "", expires: new Date(0), path: "/" });
    }
  }
  const names = ["flex-auth", "sb-qkpnvfmsmvcemdblaahl-auth-token", "sb-qkpnvfmsmvcemdblaahl-auth-token.0", "sb-qkpnvfmsmvcemdblaahl-auth-token.1", "sb-qkpnvfmsmvcemdblaahl-auth-token-code-verifier"];
  for (const name of names) {
    res.cookies.delete(name);
    res.cookies.set({ name, value: "", maxAge: 0, path: "/" });
    res.cookies.set({ name, value: "", expires: new Date(0), path: "/" });
  }
  res.cookies.set({ name: "logged_out", value: "1", maxAge: 86400, path: "/" });
  res.cookies.set({ name: "logged_out", value: "1", maxAge: 86400, path: "/", sameSite: "lax" as const });
  return res;
}
export async function POST(req: NextRequest) { return GET(req); }

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const email = body.email || "user";
  const res = NextResponse.json({ ok: true });
  res.cookies.set("flex-auth", email, { path: "/", maxAge: 86400 });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token", "logged", { path: "/", maxAge: 86400 });
  return res;
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(()=>({ email: "user" }));
  
  const res = NextResponse.json({ ok: true });

  // flex-auth 설정!
  res.cookies.set({ name: "flex-auth", value: email || "user", maxAge: 86400, path: "/", sameSite: "lax" as const });

  // logged_out 삭제!
  res.cookies.set({ name: "logged_out", value: "", maxAge: 0, path: "/" });
  res.cookies.set({ name: "logged_out", value: "", maxAge: 0, path: "/", domain: ".vercel.app" });
  res.cookies.set({ name: "logged_out", value: "", expires: new Date(0), path: "/" });
  res.cookies.delete("logged_out");

  return res;
}

export async function GET(req: NextRequest) {
  return POST(req);
}

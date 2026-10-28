import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: "logged_out", value: "", maxAge: 0, path: "/" });
  res.cookies.set({ name: "logged_out", value: "", maxAge: 0, path: "/", domain: ".vercel.app" });
  return res;
}

export async function POST(req: NextRequest) {
  return GET(req);
}

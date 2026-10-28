import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();

  const toDelete = [
    "flex-auth",
    "force_logout",
    "sb-qkpnvfmsmvcemdblaahl-auth-token",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.0",
    "sb-qkpnvfmsmvcemdblaahl-auth-token.1",
    "sb-qkpnvfmsmvcemdblaahl-auth-token-code-verifier",
  ];

  // httpOnly, secure, sameSite 맞춰서 삭제!
  for (const name of toDelete) {
    cookieStore.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    cookieStore.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    });
  }

  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth" || c.name === "force_logout") {
      cookieStore.set({
        name: c.name,
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
      cookieStore.set({
        name: c.name,
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "lax",
      });
    }
  }

  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/login", url.origin));
  
  for (const name of toDelete) {
    res.cookies.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.cookies.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    });
  }

  return res;
}

export async function POST(req: Request) {
  return GET(req);
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
      cookieStore.set(c.name, "", { maxAge: 0, path: "/" });
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("flex-auth", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token.0", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token.1", "", { maxAge: 0, path: "/" });
  res.cookies.set("force_logout", "1", { maxAge: 86400, path: "/" });
  return res;
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
      cookieStore.set(c.name, "", { maxAge: 0, path: "/" });
    }
  }

  const url = new URL(req.url);
  const redirectUrl = new URL("/login?logout=done", url.origin);
  const res = NextResponse.redirect(redirectUrl);
  
  res.cookies.set("flex-auth", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token.0", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-qkpnvfmsmvcemdblaahl-auth-token.1", "", { maxAge: 0, path: "/" });
  res.cookies.set("force_logout", "1", { maxAge: 86400, path: "/" });
  
  return res;
}

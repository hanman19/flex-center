import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  for (const c of all) {
    if (c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth") {
      cookieStore.set(c.name, "", { maxAge: 0, path: "/" });
      try { cookieStore.delete(c.name); } catch {}
    }
  }
  return NextResponse.json({ ok: true });
}
export async function GET() { return POST(); }

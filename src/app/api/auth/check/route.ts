import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  const hasAuth = all.some(c => c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth");
  return NextResponse.json({ loggedIn: hasAuth, cookies: all.map(c=>c.name) });
}

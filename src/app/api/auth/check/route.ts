import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  
  // logged_out 있으면 무조건 로그아웃!
  const hasLoggedOut = all.some(c => c.name === "logged_out");
  if (hasLoggedOut) {
    return NextResponse.json({ loggedIn: false, reason: "logged_out flag" });
  }

  const hasAuth = all.some(c => c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth");
  return NextResponse.json({ loggedIn: hasAuth, cookies: all.map(c=>c.name) });
}

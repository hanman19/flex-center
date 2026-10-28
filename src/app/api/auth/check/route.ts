import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.cookies.get("logged_out")) {
    return NextResponse.json({ loggedIn: false, reason: "logged_out flag", cookies: [] });
  }
  const cookies = req.cookies.getAll();
  const authCookies = cookies.filter(c => c.name.startsWith("sb-") || c.name.includes("supabase") || c.name === "flex-auth");
  return NextResponse.json({ loggedIn: authCookies.length > 0, cookies: authCookies.map(c => c.name) });
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

const supabase = createClient(url, key);

const ADMIN_EMAILS = ["phankyu@gmail.com", "phankyu@flexcenter.kr"];
const STAFF_EMAILS = ["staff@flexcenter.kr"];

export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { role: null, email: null, user: null };
  const email = (user.email || "").toLowerCase();
  if (ADMIN_EMAILS.includes(email)) return { role: "admin" as const, email, user };
  if (STAFF_EMAILS.includes(email)) return { role: "staff" as const, email, user };
  return { role: "seller" as const, email, user };
}

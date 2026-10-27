"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
);

const ADMIN_EMAILS = ["phankyu@gmail.com", "phankyu@flexcenter.kr"];
const STAFF_EMAILS = ["staff@flexcenter.kr"];

type Role = "seller" | "staff" | "admin" | null;

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const e = (user.email || "").toLowerCase();
      setEmail(e);
      if (ADMIN_EMAILS.includes(e)) setRole("admin");
      else if (STAFF_EMAILS.includes(e)) setRole("staff");
      else setRole("seller");
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return null;
  if (!email) return null;

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const showSellerMenus = isAdmin || role === "seller";
  const showWorkerWMS = isAdmin || isStaff;
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[56px] flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link href={isStaff ? "/admin/wms" : "/dashboard"} className="flex items-center gap-2 mr-2 shrink-0">
            <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div>
            <span className="font-bold text-[13px] hidden md:block">FLEX CENTER</span>
          </Link>
          <div className="flex items-center gap-1">
            {showSellerMenus && (
              <>
                <Link href="/dashboard" className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${isActive("/dashboard") ? "bg-black text-white" : "hover:bg-black/5 opacity-70 hover:opacity-100"}`}>대시보드</Link>
                <Link href="/products" className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${isActive("/products") ? "bg-black text-white" : "hover:bg-black/5 opacity-70 hover:opacity-100"}`}>📦 상품 마스터</Link>
                <Link href="/wms" className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${isActive("/wms") && !pathname?.startsWith("/admin/wms") ? "bg-black text-white" : "hover:bg-black/5 opacity-70 hover:opacity-100"}`}>내 창고 WMS</Link>
                <Link href="/orders" className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${isActive("/orders") ? "bg-black text-white" : "hover:bg-black/5 opacity-70 hover:opacity-100"}`}>주문관리</Link>
                <Link href="/platforms" className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${isActive("/platforms") ? "bg-black text-white" : "hover:bg-black/5 opacity-70 hover:opacity-100"}`}>플랫폼 연동</Link>
              </>
            )}
            {showWorkerWMS && (
              <Link href="/admin/wms" className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition ${isActive("/admin/wms") ? "bg-[#FFC61A] text-black border border-black" : "bg-[#FFC61A]/90 hover:bg-[#FFC61A] text-black"}`}>작업자 WMS Pro</Link>
            )}
            {isStaff && <span className="ml-2 text-[10px] bg-black text-white px-2 py-1 rounded-full font-bold">STAFF MODE · WMS ONLY</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] opacity-40 hidden md:block">{email} · {role}</span>
          <button onClick={async()=>{await supabase.auth.signOut(); router.push("/login");}} className="text-[11px] px-3 py-1.5 rounded-full border border-black/10 hover:bg-black hover:text-white transition">로그아웃</button>
        </div>
      </div>
    </div>
  );
}

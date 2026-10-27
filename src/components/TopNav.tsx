"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key"
);

const ADMIN_EMAILS = ["phankyu@gmail.com", "phankyu@flexcenter.kr"];
const STAFF_EMAILS = ["staff@flexcenter.kr"];

type Role = "seller" | "staff" | "admin" | null;

const INACTIVITY_LIMIT = 60 * 60 * 1000; // 60분
const ABSOLUTE_LIMIT = 3 * 60 * 60 * 1000; // 3시간

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [remaining, setRemaining] = useState<number>(INACTIVITY_LIMIT);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const e = (user.email || "").toLowerCase();
      setEmail(e);
      if (ADMIN_EMAILS.includes(e)) setRole("admin");
      else if (STAFF_EMAILS.includes(e)) setRole("staff");
      else setRole("seller");
    };
    init();
  }, []);

  // 자동 로그아웃 로직
  useEffect(() => {
    if (!email) return; // 로그인 안 했으면 체크 안 함

    const loginTime = Number(localStorage.getItem("flex_login_time") || Date.now());
    if (!localStorage.getItem("flex_login_time")) localStorage.setItem("flex_login_time", String(Date.now()));
    
    const updateActivity = () => {
      localStorage.setItem("flex_last_activity", String(Date.now()));
      setRemaining(INACTIVITY_LIMIT);
    };

    // 마우스, 키보드, 클릭하면 활동 시간 갱신
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(ev => window.addEventListener(ev, updateActivity));

    // 1초마다 체크
    const interval = setInterval(async () => {
      const lastActivity = Number(localStorage.getItem("flex_last_activity") || Date.now());
      const now = Date.now();
      const inactive = now - lastActivity;
      const absolute = now - loginTime;
      
      setRemaining(Math.max(0, INACTIVITY_LIMIT - inactive));

      if (inactive >= INACTIVITY_LIMIT) {
        alert("60분 동안 활동이 없어 자동 로그아웃됩니다!");
        await supabase.auth.signOut();
        localStorage.removeItem("flex_login_time");
        localStorage.removeItem("flex_last_activity");
        router.push("/login");
        clearInterval(interval);
      } else if (absolute >= ABSOLUTE_LIMIT) {
        alert("3시간이 지나 자동 로그아웃됩니다! 다시 로그인해주세요!");
        await supabase.auth.signOut();
        localStorage.removeItem("flex_login_time");
        localStorage.removeItem("flex_last_activity");
        router.push("/login");
        clearInterval(interval);
      }
    }, 1000);

    // 초기 활동 시간 설정
    updateActivity();

    return () => {
      events.forEach(ev => window.removeEventListener(ev, updateActivity));
      clearInterval(interval);
    };
  }, [email, router]);

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isSeller = role === "seller";
  const isLoggedIn = !!email;

  const showSellerMenus = !isLoggedIn || isAdmin || isSeller;
  const showWorkerWMS = isLoggedIn && (isAdmin || isStaff);
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const formatRemaining = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2,"0")}`;
  };

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
          {email && (
            <>
              <span className="text-[10px] opacity-40 hidden md:block">{email} · {role} · 자동 로그아웃 {formatRemaining(remaining)} 남음</span>
              <span className="text-[10px] opacity-40 md:hidden">{formatRemaining(remaining)}</span>
            </>
          )}
          {isLoggedIn ? (
            <button onClick={async()=>{await supabase.auth.signOut(); localStorage.removeItem("flex_login_time"); localStorage.removeItem("flex_last_activity"); router.push("/login");}} className="text-[11px] px-3 py-1.5 rounded-full border border-black/10 hover:bg-black hover:text-white transition">로그아웃</button>
          ) : (
            <Link href="/login" className="text-[11px] px-3 py-1.5 rounded-full bg-black text-white">로그인</Link>
          )}
        </div>
      </div>
    </div>
  );
}

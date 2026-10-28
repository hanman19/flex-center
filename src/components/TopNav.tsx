"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function TopNav() {
  const router = useRouter();

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    
    // 1. 브라우저 저장소 삭제 + logged_out 플래그 설정!
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("logged_out", "1");
      // 모든 sb- 쿠키 삭제 시도
      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.vercel.app`;
        }
      });
      // logged_out 플래그 확실하게 박기!
      document.cookie = `logged_out=1; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `logged_out=1; path=/; max-age=86400; SameSite=Lax; domain=.vercel.app`;
    } catch {}

    // 2. 서버 쿠키 삭제!
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include", cache: "no-store" });
      await fetch("/api/auth/logout", { method: "GET", credentials: "include", cache: "no-store" });
    } catch {}

    // 3. 로그인 페이지로!
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-20">
      <div className="max-w-[1400px] mx-auto px-6 h-[56px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
          <span className="font-semibold">FLEX CENTER</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/wms" className="text-[12px] px-3 py-1.5 rounded-full border">WMS</Link>
          <Link href="/international" className="text-[12px] px-3 py-1.5 rounded-full border">국제특송</Link>
          <Link href="/weight" className="text-[12px] px-3 py-1.5 rounded-full border">중량</Link>
          <button onClick={handleLogout} className="text-[12px] px-4 py-1.5 rounded-full bg-black text-white font-bold">로그아웃</button>
        </div>
      </div>
    </nav>
  );
}

"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try {
        // 1. Supabase 로그아웃! (global로!)
        await supabase.auth.signOut({ scope: "local" });
        await supabase.auth.signOut({ scope: "global" }).catch(()=>{});
      } catch {}

      // 2. localStorage 전부 삭제!
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith("sb-") || k.includes("supabase") || k === "flex-auth") {
          localStorage.removeItem(k);
        }
      });
      localStorage.removeItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      localStorage.removeItem("flex-auth");
      sessionStorage.clear();

      // 3. 쿠키 전부 삭제! (클라이언트)
      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });

      // 4. 서버 쿠키 삭제! (중요! 문지기가 보는 쿠키!)
      try {
        await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
        await fetch("/api/auth/logout", { method: "GET", cache: "no-store" });
      } catch {}

      // 5. 강제 이동! 캐시 없이!
      window.location.replace("/login?logout=done&t=" + Date.now());
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... 서버 쿠키 삭제!</p>
        <p className="text-[11px] opacity-50 mt-2">test@naver.com 세션 완전 삭제 중...</p>
      </div>
    </div>
  );
}

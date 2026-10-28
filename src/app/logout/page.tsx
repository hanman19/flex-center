"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try { await supabase.auth.signOut(); } catch {}
      
      // 브라우저 저장소 싹 삭제!
      try {
        localStorage.clear();
      } catch {}
      try {
        sessionStorage.clear();
      } catch {}

      // 쿠키 싹 삭제!
      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // 서버 쿠키 삭제하러 직접 이동!
      window.location.href = "/api/auth/logout";
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... 모든 세션 삭제!</p>
      </div>
    </div>
  );
}

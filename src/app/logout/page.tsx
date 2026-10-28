"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    const out = async () => {
      try {
        await supabase.auth.signOut();
      } catch {}

      // 핵심! test@naver.com 토큰 삭제!
      localStorage.removeItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      localStorage.removeItem("flex-auth");
      localStorage.removeItem("supabase.auth.token");

      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("sb-") || k.includes("supabase") || k === "flex-auth" || k === "force_logout") {
          localStorage.removeItem(k);
        }
      });

      sessionStorage.clear();

      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });

      // 서버 쿠키도 삭제!
      fetch("/api/auth/logout", { method: "POST" }).catch(()=>{});

      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    };
    out();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... test@naver.com 세션 삭제!</p>
      </div>
    </div>
  );
}

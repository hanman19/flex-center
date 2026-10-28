"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try { await supabase.auth.signOut({ scope: "local" }); } catch {}
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}

      localStorage.clear();
      sessionStorage.clear();

      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });

      // force_logout 플래그! 문지기가 보게!
      document.cookie = `force_logout=1; path=/; max-age=86400;`;
      localStorage.setItem("force_logout", "1");

      // 서버에도 force_logout 박고 sb- 삭제!
      try {
        await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
      } catch {}

      window.location.href = "/api/auth/logout";
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... force_logout 플래그 설정!</p>
      </div>
    </div>
  );
}

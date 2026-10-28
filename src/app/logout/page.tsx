"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {}
      try {
        await supabase.auth.signOut({ scope: "global" });
      } catch {}

      localStorage.removeItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("sb-") || k.includes("supabase") || k === "flex-auth") {
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

      window.location.href = "/api/auth/logout";
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold text-[13px]">로그아웃 중... 서버로 이동해 쿠키 삭제!</p>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("sb-") || k.includes("supabase") || k === "flex-auth") localStorage.removeItem(k);
      });
      sessionStorage.clear();
      document.cookie.split(";").forEach(c => {
        const n = c.split("=")[0].trim();
        if (n.startsWith("sb-") || n.includes("supabase") || n === "flex-auth") {
          document.cookie = `${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      await fetch("/api/auth/logout", { method: "POST" }).catch(()=>{});
      await fetch("/api/auth/logout", { method: "GET" }).catch(()=>{});
      window.location.href = "/login?loggedout=1";
    })();
  }, []);
  return <div className="min-h-screen flex items-center justify-center">로그아웃 중... 서버 쿠키 삭제 중...</div>;
}

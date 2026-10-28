"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  const [status, setStatus] = useState("로그아웃 중...");

  useEffect(() => {
    const doLogout = async () => {
      try {
        setStatus("1. Supabase 로그아웃 중...");
        await supabase.auth.signOut();

        setStatus("2. 서버 쿠키 삭제 중...");
        await fetch("/api/auth/logout", { method: "POST" }).catch(()=>{});
        await fetch("/api/auth/logout", { method: "GET" }).catch(()=>{});

        setStatus("3. 브라우저 저장소 정리 중...");

        // localStorage 전체 정리!
        const keys = Object.keys(localStorage);
        for (const k of keys) {
          if (
            k.includes("supabase") ||
            k.startsWith("sb-") ||
            k.includes("auth") ||
            k === "flex-auth" ||
            k === "force_logout"
          ) {
            localStorage.removeItem(k);
          }
        }
        // 혹시 몰라 전체도 한번 더!
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("flex-auth");
        localStorage.removeItem("sb-access-token");
        localStorage.removeItem("sb-refresh-token");

        sessionStorage.clear();

        // 쿠키 전부 삭제!
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
          if (
            name.includes("supabase") ||
            name.startsWith("sb-") ||
            name.includes("auth") ||
            name === "flex-auth"
          ) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.vercel.app`;
          }
        });

        setStatus("4. 완료! 홈페이지로 이동...");
        // 강제 로그아웃 플래그!
        localStorage.setItem("force_logout", "true");

        setTimeout(() => {
          window.location.href = "/?logout=true";
        }, 500);
      } catch (e) {
        console.error(e);
        setStatus("오류! 그래도 홈페이지로...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    };

    doLogout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="bg-white border rounded-[20px] p-8 text-center">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-bold">{status}</p>
        <p className="text-[11px] opacity-50 mt-2">서버 쿠키 + 브라우저 저장소 모두 삭제 중...</p>
      </div>
    </div>
  );
}

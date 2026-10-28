"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    const doLogout = async () => {
      console.log("로그아웃 시작!");
      
      // 1. Supabase 로그아웃
      try {
        await supabase.auth.signOut();
        console.log("Supabase signOut 완료!");
      } catch (e) {
        console.error("signOut 에러", e);
      }

      // 2. localStorage, sessionStorage 전체 삭제!
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log("localStorage, sessionStorage 클리어!");
      } catch {}

      // 3. document.cookie 전체 삭제!
      try {
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        console.log("document.cookie 클리어!");
      } catch {}

      // 4. 서버 쿠키 삭제 API 호출!
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        console.log("서버 쿠키 삭제 API 호출!");
      } catch {}

      // 5. 홈페이지로 강제 이동!
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    };

    doLogout();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[18px] font-black">로그아웃 중...</p>
        <p className="text-[13px] opacity-60 mt-2">Supabase 세션, localStorage, 쿠키 전체 삭제 중!</p>
        <p className="text-[11px] opacity-40 mt-4">잠시 후 홈페이지로 이동!</p>
      </div>
    </div>
  );
}

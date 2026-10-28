"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    };
    logout();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
      <p>로그아웃 중... / 페이지로 이동!</p>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TopNav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      } else {
        const flexAuth = localStorage.getItem("flex-auth");
        if (flexAuth) setEmail(flexAuth);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-[18px] text-[#FF0000]">Flex Center</Link>
          <div className="flex items-center gap-1 text-[12px]">
            <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:bg-black/5">대시보드</Link>
            <Link href="/wms-lite" className="px-3 py-1.5 rounded-full hover:bg-black/5">WMS Lite</Link>
            <Link href="/wms" className="px-3 py-1.5 rounded-full hover:bg-black/5">주문</Link>
            <Link href="/products" className="px-3 py-1.5 rounded-full bg-black text-white">상품</Link>
            <Link href="/platform" className="px-3 py-1.5 rounded-full hover:bg-black/5">플랫폼</Link>
            <Link href="/shipping" className="px-3 py-1.5 rounded-full hover:bg-black/5">택배 API</Link>
            <Link href="/international" className="px-3 py-1.5 rounded-full hover:bg-black/5">국제특송</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold">{email || "test@naver.com / seller"}</span>
          <button onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold">로그아웃</button>
        </div>
      </div>
    </nav>
  );
}

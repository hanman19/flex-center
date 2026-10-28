"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        const hasLoggedOut = document.cookie.includes("logged_out") || localStorage.getItem("logged_out");
        if (hasLoggedOut) router.push("/login");
      } else {
        setUser(data.user);
      }
    });
  }, []);

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("logged_out", "1");
      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      document.cookie = `logged_out=1; path=/; max-age=86400; SameSite=Lax`;
    } catch {}

    try {
      await fetch("/api/auth/logout", { cache: "no-store" });
    } catch {}

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white border rounded-[20px] p-6 flex justify-between items-center">
          <div>
            <h1 className="font-black text-[20px]">대시보드</h1>
            <p className="text-[12px] opacity-60 mt-1">{user?.email || "로딩중..."}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="px-4 py-2 rounded-full border text-[12px]">홈으로</Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-black text-white text-[12px] font-bold">로그아웃</button>
          </div>
        </div>
        
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Link href="/wms" className="bg-white border rounded-[16px] p-5 hover:shadow"><p className="font-bold">WMS</p><p className="text-[11px] opacity-60 mt-1">재고 관리</p></Link>
          <Link href="/platforms" className="bg-white border rounded-[16px] p-5 hover:shadow"><p className="font-bold">플랫폼 연동</p><p className="text-[11px] opacity-60 mt-1">판매 채널</p></Link>
          <Link href="/shipping" className="bg-white border rounded-[16px] p-5 hover:shadow"><p className="font-bold">배송</p><p className="text-[11px] opacity-60 mt-1">출고 관리</p></Link>
        </div>
      </div>
    </div>
  );
}

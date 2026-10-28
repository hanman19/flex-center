"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TopNavFixed() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string>("seller");
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        if (user.email === "phankyu@gmail.com") {
          setRole("admin");
        } else {
          try {
            const { data } = await supabase.from("seller_profiles").select("role").eq("email", user.email).single();
            if (data?.role) setRole(data.role);
          } catch {}
        }
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    console.log("로그아웃 시작!");
    try {
      // 1. 클라이언트 로그아웃
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      
      // 2. 서버 쿠키 로그아웃 API 호출!
      await fetch("/api/auth/logout", { method: "POST" });
      
      console.log("로그아웃 완료! 홈페이지로!");
      window.location.href = "/";
    } catch (e) {
      console.error("로그아웃 에러", e);
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      window.location.href = "/";
    }
  };

  const isActive = (path: string) => typeof window !== "undefined" && window.location.pathname.startsWith(path);

  const menus = [
    { name: "대시보드", path: "/dashboard" },
    { name: "WMS Lite", path: "/wms-lite" },
    { name: "주문", path: "/orders" },
    { name: "정산", path: "/settlement" },
    { name: "플랫폼", path: "/platforms" },
    { name: "택배 API", path: "/shipments", new: true },
    { name: "국제특송", path: "/international", new: true },
    { name: "상품", path: "/products" },
  ];

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="font-black text-[18px] text-[#FF0000]">Flex Center</a>
          <div className="flex items-center gap-1">
            {menus.map((menu) => (
              <a
                key={menu.path}
                href={menu.path}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1 ${isActive(menu.path) ? "bg-black text-white" : "text-black/60 hover:bg-black/5"}`}
              >
                {menu.name}
                {menu.new && <span className="bg-[#FFC61A] text-black border border-black px-1.5 py-0.5 rounded-full text-[8px]">NEW</span>}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-bold">{email || "test@naver.com"} / {role}</p>
            <p className="text-[10px] opacity-60">자동 로그아웃: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</p>
          </div>
          <button type="button" onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-black/80 cursor-pointer">로그아웃</button>
          <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[11px] font-bold">T</div>
        </div>
      </div>
    </nav>
  );
}

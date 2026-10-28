"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("seller");
  const [user, setUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from("sellers").select("role").eq("user_id", user.id).single();
        if (data) setRole(data.role || "seller");
      }
    };
    getUser();

    const resetTimer = () => setTimeLeft(1800);
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          supabase.auth.signOut();
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const sellerMenus = [
    { name: "대시보드", path: "/dashboard" },
    { name: "상품", path: "/products" },
    { name: "WMS", path: "/wms" },
    { name: "주문", path: "/orders" },
    { name: "정산", path: "/settlement" },
    { name: "플랫폼", path: "/platforms" },
  ];

  const staffMenus = [
    { name: "대시보드", path: "/dashboard" },
    { name: "WMS Pro", path: "/admin/wms" },
    { name: "주문", path: "/orders" },
    { name: "정산", path: "/settlement" },
    { name: "입고", path: "/admin/inbound" },
    { name: "재고", path: "/admin/inventory" },
    { name: "셀러 관리", path: "/admin/sellers" },
  ];

  const menus = role === "staff" || role === "admin" ? staffMenus : sellerMenus;

  if (pathname === "/login" || pathname === "/onboarding") return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black/5 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-black text-[18px] tracking-tight">Flex Center</Link>
        <div className="flex items-center gap-1">
          {menus.map(m => (
            <Link
              key={m.path}
              href={m.path}
              className={`px-4 py-2 rounded-full text-[12px] font-bold transition ${isActive(m.path) ? "bg-black text-white" : "hover:bg-black/5"}`}
            >
              {m.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] opacity-50 font-mono">{minutes}:{seconds.toString().padStart(2, "0")} 후 자동 로그아웃</span>
        <span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[10px] font-black border border-black">{role === "staff" || role === "admin" ? "김포센터 STAFF" : "SELLER"} · {user?.email?.split("@")[0]}</span>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold">로그아웃</button>
      </div>
    </nav>
  );
}

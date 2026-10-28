"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("seller");
  const [email, setEmail] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30분
  const [absoluteLeft, setAbsoluteLeft] = useState<number>(12 * 60 * 60); // 12시간

  // 메뉴 - seller와 staff/admin 구분 + 택배 API 추가!
  const sellerMenus = [
    { name: "대시보드", path: "/dashboard" },
    { name: "WMS Lite", path: "/wms" },
    { name: "주문", path: "/orders" },
    { name: "정산", path: "/settlement" },
    { name: "플랫폼", path: "/platforms" },
    { name: "택배 API", path: "/shipments", badge: "NEW" },
    { name: "상품", path: "/products" },
  ];

  const staffMenus = [
    { name: "대시보드", path: "/dashboard" },
    { name: "WMS Pro", path: "/admin/wms" },
    { name: "주문", path: "/orders" },
    { name: "정산", path: "/settlement" },
    { name: "입고", path: "/admin/inbound" },
    { name: "재고", path: "/admin/inventory" },
    { name: "셀러 관리", path: "/admin/sellers" },
    { name: "플랫폼", path: "/platforms" },
    { name: "택배 API", path: "/shipments", badge: "NEW" },
    { name: "상품", path: "/products" },
  ];

  const menus = role === "seller" ? sellerMenus : staffMenus;

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        // phankyu@gmail.com은 무조건 admin!
        if (user.email === "phankyu@gmail.com") {
          setRole("admin");
          return;
        }
        // seller_profiles 테이블에서 role 조회!
        const { data } = await supabase.from("seller_profiles").select("role").eq("email", user.email).single();
        if (data?.role) {
          setRole(data.role);
        } else {
          // role 없으면 seller 기본!
          setRole("seller");
        }
      }
    };
    init();

    // 자동 로그아웃 - 30분 무활동 + 12시간 절대!
    let lastActivity = Date.now();
    const loginTime = Date.now();

    const resetActivity = () => { lastActivity = Date.now(); setTimeLeft(30*60); };
    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keydown", resetActivity);
    window.addEventListener("click", resetActivity);

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveSec = Math.floor((now - lastActivity)/1000);
      const absoluteSec = Math.floor((now - loginTime)/1000);
      
      const remainingInactive = Math.max(0, 30*60 - inactiveSec);
      const remainingAbsolute = Math.max(0, 12*60*60 - absoluteSec);
      
      setTimeLeft(remainingInactive);
      setAbsoluteLeft(remainingAbsolute);

      if (remainingInactive <= 0 || remainingAbsolute <= 0) {
        supabase.auth.signOut().then(()=>router.push("/login"));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keydown", resetActivity);
      window.removeEventListener("click", resetActivity);
    };
  }, [router]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec/60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2,"0")}`;
  };

  if (!mounted) return null;

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-black text-[16px]">Flex Center</Link>
          <div className="flex items-center gap-1 flex-wrap">
            {menus.map(m => {
              const active = pathname?.startsWith(m.path);
              return (
                <Link key={m.path} href={m.path} className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${active ? "bg-black text-white" : "hover:bg-black/5"}`}>
                  {m.name}
                  {m.badge && <span className="bg-[#FFC61A] text-black px-1.5 py-0.5 rounded-full text-[8px] border border-black">{m.badge}</span>}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-bold">{email} / {role}</p>
            <p className="text-[10px] opacity-50">자동 로그아웃: {formatTime(timeLeft)} / 절대: {formatTime(absoluteLeft)}</p>
          </div>
          <button onClick={async()=>{ await supabase.auth.signOut(); router.push("/login"); }} className="bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-bold">로그아웃</button>
          <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">{email.slice(0,1).toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

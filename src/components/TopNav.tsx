"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
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
          const { data } = await supabase.from("seller_profiles").select("role").eq("email", user.email).single();
          if (data?.role) setRole(data.role);
        }
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          supabase.auth.signOut().then(()=> router.push("/"));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    const resetTimer = () => setTimeLeft(1800);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const menus = [
    { name: "대시보드", path: "/dashboard", pro: true },
    { name: "WMS Lite", path: "/wms-lite", pro: false },
    { name: "WMS Pro", path: "/wms", pro: true, adminOnly: true },
    { name: "주문", path: "/orders", pro: false },
    { name: "정산", path: "/settlement", pro: true },
    { name: "입고", path: "/admin/inbound", pro: true, adminOnly: true },
    { name: "재고", path: "/admin/inventory", pro: true, adminOnly: true },
    { name: "셀러 관리", path: "/admin/sellers", pro: true, adminOnly: true },
    { name: "플랫폼", path: "/platforms", pro: true },
    { name: "택배 API", path: "/shipments", pro: true, new: true },
    { name: "국제특송", path: "/international", pro: true, new: true, adminOnly: true },
    { name: "상품", path: "/products", pro: false },
  ];

  const visibleMenus = menus.filter(m => {
    if (m.adminOnly && role !== "admin" && email !== "phankyu@gmail.com") return false;
    return true;
  });

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-[18px] text-[#FF0000]">Flex Center</Link>
          <div className="flex items-center gap-1">
            {visibleMenus.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1 ${isActive(menu.path) ? "bg-black text-white" : "text-black/60 hover:bg-black/5"}`}
              >
                {menu.name}
                {menu.new && <span className="bg-[#FFC61A] text-black border border-black px-1.5 py-0.5 rounded-full text-[8px]">NEW</span>}
                {menu.pro && <span className="opacity-50 text-[9px]">Pro</span>}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-bold">{email || "test@naver.com"} / {role}</p>
            <p className="text-[10px] opacity-60">자동 로그아웃: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")} / 절대: 719:55</p>
          </div>
          <button onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold">로그아웃</button>
          <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[11px] font-bold">T</div>
        </div>
      </div>
    </nav>
  );
}

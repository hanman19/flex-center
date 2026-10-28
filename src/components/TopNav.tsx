"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const ADMIN_MENUS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/wms", label: "WMS" },
  { href: "/products", label: "상품" },
  { href: "/platforms", label: "플랫폼" },
  { href: "/orders", label: "주문" },
  { href: "/settlement", label: "정산" },
  { href: "/shipping", label: "배송" },
  { href: "/international", label: "국제특송" },
  { href: "/weight", label: "중량" },
  { href: "/admin", label: "관리자" },
];

const SELLER_MENUS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/products", label: "내 상품" },
  { href: "/orders", label: "주문" },
  { href: "/shipping", label: "배송조회" },
  { href: "/settlement", label: "정산" },
];

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<"admin"|"seller">("seller");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const e = data.user?.email || "";
        setEmail(e);
        if (e === "phankyu@gmail.com" || e.includes("admin")) {
          setRole("admin");
        } else {
          setRole("seller");
        }
      } catch {
        setRole("seller");
      }
    };
    getUser();
  }, []);

  const MENUS = role === "admin" ? ADMIN_MENUS : SELLER_MENUS;

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
      await fetch("/api/auth/logout", { method: "POST", credentials: "include", cache: "no-store" });
    } catch {}
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-20">
      <div className="max-w-[1400px] mx-auto px-6 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
            <span className="font-semibold">FLEX CENTER</span>
            <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${role==="admin" ? "bg-black text-white" : "bg-black/5"}`}>{role==="admin" ? "관리자" : "셀러"}</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {MENUS.map(m => {
              const active = pathname.startsWith(m.href);
              return (
                <Link key={m.href} href={m.href} className={`text-[12px] px-3 py-1.5 rounded-full ${active ? "bg-black text-white" : "hover:bg-black/5 border border-transparent"}`}>
                  {m.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] opacity-50 hidden md:block">{email}</span>
          <button onClick={handleLogout} className="text-[12px] px-4 py-1.5 rounded-full bg-black text-white font-bold">로그아웃</button>
        </div>
      </div>
      <div className="md:hidden border-t border-black/5 px-4 py-2 flex gap-1 overflow-x-auto">
        {MENUS.map(m => (
          <Link key={m.href} href={m.href} className="text-[11px] px-3 py-1 rounded-full border whitespace-nowrap">{m.label}</Link>
        ))}
      </div>
    </nav>
  );
}

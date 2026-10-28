"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

const MENU = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/wms-lite", label: "WMS Lite" },
  { href: "/wms", label: "주문" },
  { href: "/settlement", label: "정산" },
  { href: "/platform", label: "플랫폼" },
  { href: "/shipping", label: "택배 API", badge: "NEW" },
  { href: "/international", label: "국제특송", badge: "NEW" },
  { href: "/products", label: "상품" },
  { href: "/weight", label: "무게" },
  { href: "/operation", label: "운영" },
];

export default function TopNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState("seller");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // flex-auth 쿠키도 체크
      const flexAuth = localStorage.getItem("flex-auth");
      const forceLogout = localStorage.getItem("force_logout");

      if (forceLogout === "true") {
        setEmail(null);
        setLoading(false);
        // 보호된 경로면 로그인으로!
        if (pathname && !pathname.startsWith("/login") && pathname !== "/") {
          router.push("/login");
        }
        return;
      }

      if (user?.email) {
        setEmail(user.email);
        if (user.email === "phankyu@gmail.com" || user.email === "hanman1982@naver.com") {
          setRole("admin");
        }
      } else if (flexAuth) {
        setEmail(flexAuth);
        if (flexAuth === "phankyu@gmail.com") setRole("admin");
      } else {
        setEmail(null);
        // 로그인 안 됐는데 보호된 페이지면 /login으로!
        const protectedPaths = ["/dashboard", "/wms", "/international", "/weight", "/operation", "/settlement", "/platform", "/shipping", "/products", "/admin"];
        const isProtected = protectedPaths.some(p => pathname?.startsWith(p));
        if (isProtected) {
          router.push("/login");
        }
      }
      setLoading(false);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
      } else {
        const flexAuth = localStorage.getItem("flex-auth");
        if (!flexAuth) setEmail(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("flex-auth");
    localStorage.setItem("force_logout", "true");
    // 쿠키 삭제
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    setEmail(null);
    window.location.href = "/";
  };

  if (pathname === "/" || pathname === "/login" || pathname?.startsWith("/logout")) {
    return null;
  }

  if (loading) {
    return <div className="h-[56px] border-b bg-white" />;
  }

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-[18px] text-[#FF0000]">Flex Center</Link>
          <nav className="hidden lg:flex items-center gap-1">
            {MENU.map(m => {
              const active = pathname?.startsWith(m.href);
              return (
                <Link key={m.href} href={m.href} className={`px-3 py-1.5 rounded-full text-[13px] ${active ? "bg-black text-white" : "hover:bg-black/5"}`}>
                  {m.label}
                  {m.badge && <span className="ml-1 text-[9px] bg-[#FFC61A] text-black px-1.5 py-0.5 rounded-full font-bold">{m.badge}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {email ? (
            <>
              <div className="text-right hidden md:block">
                <p className="text-[12px] font-bold">{email} / {role}</p>
                <p className="text-[10px] opacity-50">자동 로그아웃: 30:00</p>
              </div>
              <button onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full text-[12px] font-bold hover:bg-black/80">로그아웃</button>
              <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[11px] font-bold">{email[0].toUpperCase()}</div>
            </>
          ) : (
            <Link href="/login" className="bg-black text-white px-4 py-1.5 rounded-full text-[12px] font-bold">로그인</Link>
          )}
        </div>
      </div>
    </div>
  );
}

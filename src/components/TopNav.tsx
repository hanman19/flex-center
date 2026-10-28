"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        return;
      }
      const flexAuth = localStorage.getItem("flex-auth");
      const forceLogout = localStorage.getItem("force_logout");
      if (forceLogout === "true") {
        setEmail(null);
        return;
      }
      if (flexAuth) setEmail(flexAuth);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) setEmail(session.user.email);
      else setEmail(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    // /logout 페이지로 이동! 거기서 완전 삭제!
    router.push("/logout");
  };

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-[18px]">Flex Center</Link>
          <div className="hidden md:flex items-center gap-1 text-[12px]">
            <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-black text-white">대시보드</Link>
            <Link href="/wms-lite" className="px-3 py-1.5 rounded-full hover:bg-black/5">WMS Lite</Link>
            <Link href="/wms" className="px-3 py-1.5 rounded-full hover:bg-black/5">WMS Pro</Link>
            <Link href="/products" className="px-3 py-1.5 rounded-full hover:bg-black/5">상품</Link>
            <Link href="/platforms" className="px-3 py-1.5 rounded-full hover:bg-black/5">플랫폼</Link>
            <Link href="/international" className="px-3 py-1.5 rounded-full hover:bg-black/5">국제특송</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {email ? (
            <>
              <span className="text-[11px] hidden md:block">{email}</span>
              <button onClick={handleLogout} className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-black/80">
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-black text-white px-4 py-1.5 rounded-full text-[11px] font-bold">
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      // force_logout 있으면 무조건 로그아웃!
      const forceLogout = localStorage.getItem("force_logout") || document.cookie.includes("force_logout=1");
      if (forceLogout) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }
      } catch {}

      // sb- 토큰 확인!
      const sbToken = localStorage.getItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      const flexAuth = localStorage.getItem("flex-auth");
      if (sbToken || flexAuth) {
        // 토큰 있는데 force_logout 없으면 로그인!
        try {
          const parsed = sbToken ? JSON.parse(sbToken) : null;
          if (parsed?.access_token || flexAuth) setIsLoggedIn(true);
          else setIsLoggedIn(false);
        } catch {
          setIsLoggedIn(!!flexAuth);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    check();
  }, []);

  const goMember = () => {
    // force_logout 있으면 무조건 /login!
    const forceLogout = localStorage.getItem("force_logout") || document.cookie.includes("force_logout=1");
    if (forceLogout) {
      router.push("/login?logout=done");
      return;
    }
    if (isLoggedIn) router.push("/dashboard");
    else router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <nav className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <Link href="/" className="font-black">F FLEX CENTER <span className="text-[10px] ml-2 opacity-50">BETA SERVICE</span></Link>
          <div className="flex gap-2">
            <Link href="/pricing" className="px-4 py-1.5 rounded-full border text-[12px]">요금제</Link>
            <button onClick={goMember} className="px-4 py-1.5 rounded-full bg-black text-white text-[12px] font-bold">
              {loading ? "확인중..." : isLoggedIn ? "대시보드 →" : "회원전용 →"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-16">
        <p className="text-[11px] tracking-widest opacity-40">SMART FULFILLMENT</p>
        <h1 className="text-[40px] font-black leading-tight mt-2">
          누구나 자유롭게<br/>이용할 수 있는<br/><span className="opacity-20">풀필먼트 플랫폼</span>
        </h1>
        <p className="mt-4 text-[13px] opacity-60">집이 창고가 되었다면, 이제 맡기세요. 보관, 피킹, 포장, 출고까지 월 구독 한 번으로 끝.</p>
        <div className="mt-6 flex gap-2">
          <Link href="/pricing" className="bg-black text-white px-6 py-3 rounded-full text-[13px]">요금제 보기 →</Link>
          <button onClick={goMember} className="bg-white border px-6 py-3 rounded-full text-[13px]">회원전용 입장</button>
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-[20px] p-4 text-[11px]">
          <p className="font-bold">로그아웃 테스트: {loading ? "확인중..." : isLoggedIn ? "로그인됨" : "로그아웃됨 - 회원전용 누르면 /login으로 가야 정상!"}</p>
          <p className="opacity-60 mt-1">force_logout: {typeof window !== 'undefined' && localStorage.getItem("force_logout") ? "있음 (로그아웃 상태)" : "없음 (로그인 상태)"} | sb-토큰: {typeof window !== 'undefined' && localStorage.getItem("sb-qkpnvfmsmvcemdblaahl-auth-token") ? "있음" : "없음"}</p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-[16px] p-5"><p className="font-bold text-[13px]">입고</p><p className="text-[11px] opacity-60 mt-2">택배로 보내기만 하세요. 검수 후 선반/파렛트에 보관.</p></div>
          <div className="bg-white border rounded-[16px] p-5"><p className="font-bold text-[13px]">주문 연동</p><p className="text-[11px] opacity-60 mt-2">카페24, 스마트스토어 자동 연동. 주문 들어오면 바로 피킹.</p></div>
          <div className="bg-white border rounded-[16px] p-5"><p className="font-bold text-[13px]">출고</p><p className="text-[11px] opacity-60 mt-2">포장부터 송장까지 당일 출고. 배송조회 문자 자동 발송.</p></div>
        </div>
      </main>
    </div>
  );
}

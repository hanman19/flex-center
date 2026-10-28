"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/check?t=" + Date.now(), { cache: "no-store" });
        const data = await res.json();
        
        if (data.reason === "logged_out flag" || document.cookie.includes("logged_out") || localStorage.getItem("logged_out")) {
          if (!data.loggedIn) {
            localStorage.clear();
            sessionStorage.clear();
          }
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(data.loggedIn);
          if (!data.loggedIn) localStorage.clear();
        }
      } catch {
        if (localStorage.getItem("logged_out") || document.cookie.includes("logged_out")) {
          localStorage.clear();
          setIsLoggedIn(false);
        } else {
          const hasFlex = !!localStorage.getItem("flex-auth");
          setIsLoggedIn(hasFlex);
        }
      }
      setLoading(false);
    };
    check();
  }, []);

  const goMember = () => {
    if (localStorage.getItem("logged_out") || document.cookie.includes("logged_out")) {
      router.push("/login");
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
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[11px] tracking-widest opacity-40">SMART FULFILLMENT</p>
            <h1 className="text-[40px] font-black leading-tight mt-2">누구나 자유롭게<br/>이용할 수 있는<br/><span className="opacity-20">풀필먼트 플랫폼</span></h1>
            <p className="mt-4 text-[13px] opacity-60">집이 창고가 되었다면, 이제 맡기세요. 보관, 피킹, 포장, 출고까지 월 구독 한 번으로 끝.</p>
            <div className="mt-6 flex gap-2">
              <Link href="/pricing" className="bg-black text-white px-6 py-3 rounded-full text-[13px]">요금제 보기 →</Link>
              <button onClick={goMember} className="bg-white border px-6 py-3 rounded-full text-[13px]">회원전용 입장</button>
            </div>
          </div>
          <div className="bg-white border border-black/5 rounded-[24px] p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-[24px] font-black">500+</p><p className="text-[11px] opacity-60">파트너</p></div>
              <div><p className="text-[24px] font-black">99.2%</p><p className="text-[11px] opacity-60">정확도</p></div>
              <div><p className="text-[24px] font-black">당일</p><p className="text-[11px] opacity-60">출고</p></div>
            </div>
            <div className="mt-6 bg-[#fafaf8] rounded-[16px] p-4 text-[11px]">
              <p className="font-bold">SMART FULFILLMENT PLATFORM</p>
              <p className="opacity-60 mt-1">로그아웃 후 회원전용을 누르면 /login으로 이동하면 정상!</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-[16px] p-5"><p className="font-bold text-[13px]">입고</p><p className="text-[11px] opacity-60 mt-2">택배로 보내기만 하세요. 검수 후 선반/파렛트에 보관.</p></div>
          <div className="bg-white border rounded-[16px] p-5"><p className="font-bold text-[13px]">주문 연동</p><p className="text-[11px] opacity-60 mt-2">카페24, 스마트스토어 자동 연동. 주문 들어오면 바로 피킹.</p></div>
          <div className="bg-white border rounded-[16px] p-5"><p className="font-bold text-[13px]">출고</p><p className="text-[11px] opacity-60 mt-2">포장부터 송장까지 당일 출고. 배송조회 문자 자동 발송.</p></div>
        </div>
      </main>
    </div>
  );
}

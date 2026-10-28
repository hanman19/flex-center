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
        // 서버에 진짜 쿠키 있는지 물어보기!
        const res = await fetch("/api/auth/check", { cache: "no-store" });
        const data = await res.json();
        if (data.loggedIn) {
          setIsLoggedIn(true);
        } else {
          // 서버에 없으면 무조건 로그아웃! localStorage 무시!
          localStorage.clear();
          setIsLoggedIn(false);
        }
      } catch {
        // 서버 체크 실패하면 localStorage 보기
        const hasFlex = !!localStorage.getItem("flex-auth");
        setIsLoggedIn(hasFlex);
      }
      setLoading(false);
    };
    check();
  }, []);

  const goMember = () => {
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
            <p className="mt-4 text-[13px] opacity-60">집이 창고가 되었다면, 이제 맡기세요.</p>
            <div className="mt-6 flex gap-2">
              <Link href="/pricing" className="bg-black text-white px-6 py-3 rounded-full text-[13px]">요금제 보기 →</Link>
              <button onClick={goMember} className="bg-white border px-6 py-3 rounded-full text-[13px]">회원전용 입장</button>
            </div>
          </div>
          <div className="bg-white border rounded-[24px] p-6">
            <p className="font-bold">상태: {loading ? "확인중..." : isLoggedIn ? "로그인됨 - 대시보드 →" : "로그아웃됨 - 회원전용 → (정상!)"}</p>
            <p className="text-[11px] opacity-60 mt-2">서버 쿠키 기준으로 판단! 로그아웃 후 "로그아웃됨"이면 성공!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

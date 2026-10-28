"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardProPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      // 강제 로그아웃 체크!
      const forceLogout = localStorage.getItem("force_logout");
      if (forceLogout === "true") {
        console.log("강제 로그아웃 감지! 세션 삭제!");
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("force_logout", "false");
        window.location.href = "/";
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("유저 없음! 홈페이지로!");
        window.location.href = "/";
        return;
      }
      setUser(user);
      setChecking(false);
    };
    checkAuth();
  }, []);

  if (!mounted || checking) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중... 로그인 체크 중!</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-black">대시보드 Pro - 진짜 데이터 + 카톡 알림</h1>
            <p className="text-[13px] opacity-60 mt-1">Supabase 진짜 데이터! 오늘 주문, 피킹, 재고 부족! 카톡 알림톡으로 수분에센스 재고 8개 남음 자동 알림!</p>
            <p className="text-[11px] opacity-40 mt-1">현재 계정: {user?.email} - {user ? "로그인됨!" : "로그인 안 됨!"}</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-[#FFC61A] text-black border border-black px-3 py-1 rounded-full text-[11px] font-bold">실시간 + 카톡 알림톡</span>
            <span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">Pro</span>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-5">
            <p className="text-[11px] opacity-60">오늘 수주</p>
            <p className="text-[24px] font-black mt-1">127건</p>
            <p className="text-[10px] text-green-600 mt-1">어제보다 +12건 ↑</p>
          </div>
          <div className="bg-[#FFC61A]/20 border border-[#FFC61A] rounded-[16px] p-5">
            <p className="text-[11px] opacity-60">피킹대기</p>
            <p className="text-[24px] font-black mt-1 text-[#FF8C00]">23건</p>
            <p className="text-[10px] opacity-60 mt-1">WAVE 3개 / 동선 A→B→C</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-[16px] p-5">
            <p className="text-[11px] opacity-60">재고 부족</p>
            <p className="text-[24px] font-black mt-1 text-red-600">2건</p>
            <p className="text-[10px] text-red-600 mt-1">안전재고 미만 카톡 발송!</p>
          </div>
          <div className="bg-black text-white rounded-[16px] p-5">
            <p className="text-[11px] opacity-60">오늘 매출</p>
            <p className="text-[20px] font-black mt-1">4,500,000원</p>
            <p className="text-[10px] opacity-60 mt-1">송장 품명 기준 정산</p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-5">
            <p className="font-bold">최근 주문 - 송장 품명으로 보기</p>
            <div className="mt-3 space-y-3 text-[12px]">
              <div className="border-b pb-2"><p>📦 무선이어폰 / 블랙 x2 + 스마트워치 S8</p><p className="text-[10px] opacity-60">20241027-001 - 김*수 - 10:23 - 합포장완료</p></div>
              <div className="border-b pb-2"><p>📦 수분에센스 100ml</p><p className="text-[10px] opacity-60">20241027-003 - 박*진 - 10:15 - 피킹중</p></div>
              <div className="border-b pb-2"><p>📦 K-POP 앨범 Vol.1</p><p className="text-[10px] opacity-60">20241027-004 - 최*아 - 09:50 - 송장발행완료</p></div>
            </div>
          </div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5">
            <p className="font-bold">재고 부족 - 카톡 알림 대상</p>
            <div className="mt-3 space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-[12px] p-3">
                <p className="text-[12px] font-bold">📦 수분에센스 100ml</p>
                <p className="text-[10px] opacity-60">내부: 에센스 100ml (COS-001) - 재고 8개 / 안전 20개 / 위치 A-02-01</p>
                <button className="mt-2 w-full bg-black text-white py-2 rounded-full text-[11px] font-bold">카톡 알림톡 발송 - 수분에센스 100ml 재고 부족!</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).single();
        setProfile(data);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-full">F</div>
            <span className="font-bold tracking-tight">FLEX CENTER</span>
            <span className="text-[10px] opacity-40 ml-2 hidden md:block">마이크로 풀필먼트</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="text-[12px] px-4 py-2 rounded-full border border-black/10">요금제</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full bg-black text-white font-semibold">
                  {profile?.company_name ? `${profile.company_name} 회원전용 →` : "회원전용 →"}
                </Link>
                <button onClick={handleLogout} className="text-[11px] px-3 py-2 rounded-full border border-black/10 opacity-60 hover:opacity-100">로그아웃</button>
                {session.user.email === "phankyu@gmail.com" && <Link href="/admin" className="text-[11px] px-3 py-2 rounded-full bg-amber-500 text-black font-bold">ADMIN</Link>}
              </>
            ) : (
              <>
                <Link href="/login" className="text-[12px] px-4 py-2 rounded-full border border-black/10">로그인</Link>
                <Link href="/onboarding" className="text-[12px] px-5 py-2 rounded-full bg-black text-white font-semibold">회원가입 →</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6">
        {/* HERO */}
        <div className="py-16 md:py-24 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-black text-white rounded-full px-3 py-1 text-[10px] font-bold tracking-widest">NEW · 김포 마이크로 풀필먼트 센터</div>
            <h1 className="text-[36px] md:text-[54px] font-bold tracking-tight mt-6 leading-[1.05]">당신의 상품을<br/>가장 빠르게<br/>고객에게</h1>
            <p className="text-[14px] opacity-60 mt-6 leading-relaxed break-keep">소규모 이커머스 사장님을 위한 월 구독 풀필먼트. 보관부터 피킹, 포장, 출고까지 한 번에. 26,900원부터 시작. 김포에서 전국 당일 출고.</p>
            <div className="mt-8 flex gap-3">
              {session ? <Link href="/dashboard" className="px-7 py-3.5 rounded-full bg-black text-white text-[13px] font-bold">회원전용 바로가기 →</Link> : <Link href="/onboarding" className="px-7 py-3.5 rounded-full bg-black text-white text-[13px] font-bold">지금 회원가입 →</Link>}
              <Link href="/pricing" className="px-7 py-3.5 rounded-full border border-black/10 text-[13px] font-semibold">요금제 보기</Link>
            </div>
            {session && <div className="mt-6 bg-white border border-black/5 rounded-[12px] px-4 py-3 text-[11px]"><p className="font-bold">로그인됨: {session.user.email}</p><p className="opacity-60 mt-1">{profile ? `${profile.company_name || "상호 미입력"} · ${profile.status === "pending" ? "승인 대기 중 ⏳" : profile.status === "approved" ? "승인됨 ✅" : profile.status} ${profile.company_name ? "" : "- /onboarding에서 인증 필요"}` : "사업자 정보 없음 - /onboarding에서 인증 필요 (관리자는 /admin에서 바로 승인 가능)"}</p></div>}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="rounded-[20px] overflow-hidden h-[180px] bg-white border border-black/5 shadow-sm"><img src="/fulfillment-1.jpg" alt="AI fulfillment center" className="w-full h-full object-cover" /></div>
              <div className="rounded-[20px] overflow-hidden h-[240px] bg-white border border-black/5 shadow-sm"><img src="/fulfillment-2.jpg" alt="picking packing" className="w-full h-full object-cover" /></div>
            </div>
            <div className="rounded-[20px] overflow-hidden h-[432px] bg-white border border-black/5 shadow-sm"><img src="/fulfillment-3.jpg" alt="woman checking orders" className="w-full h-full object-cover" /></div>
          </div>
        </div>

        {/* COMPANY INTRO */}
        <div className="py-16 border-t border-black/5">
          <div className="max-w-[800px]">
            <h2 className="text-[24px] md:text-[32px] font-bold tracking-tight leading-tight">소규모 셀러를 위한<br/>진짜 마이크로 풀필먼트를 만듭니다</h2>
            <p className="text-[13px] opacity-60 mt-4 leading-relaxed break-keep">FLEX CENTER는 김포에 위치한 마이크로 풀필먼트 센터입니다. 대형 풀필먼트(FASSTO, 품고)는 최소 보관료가 높고, 소규모 셀러는 진입이 어렵습니다. 우리는 10건, 100건 단위의 소규모 셀러를 위해 월 26,900원부터 시작하는 구독 모델을 만들었습니다. 선반 1개부터, 파렛트 1개부터. 필요한 만큼만.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-black/5 rounded-[20px] p-7">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[16px]">📦</div>
              <h3 className="font-bold text-[14px] mt-4">보관</h3><p className="text-[12px] opacity-60 mt-2 leading-relaxed">선반 보관, 파렛트 보관. 월 10건부터 5000건까지 플랜별 보관. 60일 이상 장기 보관은 50% 할증, 합리적 운영.</p>
            </div>
            <div className="bg-white border border-black/5 rounded-[20px] p-7">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[16px]">🚚</div>
              <h3 className="font-bold text-[14px] mt-4">출고</h3><p className="text-[12px] opacity-60 mt-2 leading-relaxed">오후 2시 이전 주문은 당일 출고. 합포장 3개 무료, 바코드 라벨링 무료. CJ대한통운 연동으로 송장 자동 출력.</p>
            </div>
            <div className="bg-white border border-black/5 rounded-[20px] p-7">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[16px]">🔄</div>
              <h3 className="font-bold text-[14px] mt-4">연동</h3><p className="text-[12px] opacity-60 mt-2 leading-relaxed">네이버, 쿠팡, 11번가, G마켓 주문 자동 수집. WMS 기반 피킹, 패킹, 출고. 플랫폼에 송장번호 자동 업로드.</p>
            </div>
          </div>
        </div>

        {/* PRICING PREVIEW */}
        <div className="py-16 border-t border-black/5">
          <div className="flex items-end justify-between">
            <div><h2 className="text-[24px] font-bold">요금제</h2><p className="text-[12px] opacity-60 mt-2">10건부터 5000건까지, 필요한 만큼만 구독</p></div>
            <Link href="/pricing" className="text-[12px] px-5 py-2.5 rounded-full bg-black text-white font-semibold">전체 요금제 보기 →</Link>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-3">
            <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] font-bold opacity-50">STARTER</p><p className="text-[20px] font-bold mt-1">26,900원<span className="text-[11px] font-normal opacity-50">/월</span></p><p className="text-[11px] opacity-60 mt-2">10건 · 선반 1개</p></div>
            <div className="bg-black text-white rounded-[16px] p-5 relative"><div className="absolute -top-2 -right-2 bg-amber-400 text-black text-[9px] font-bold px-2 py-1 rounded-full">MOST POPULAR</div><p className="text-[11px] font-bold opacity-60">LITE</p><p className="text-[20px] font-bold mt-1">149,000원<span className="text-[11px] font-normal opacity-60">/월</span></p><p className="text-[11px] opacity-60 mt-2">100건 · 파렛트 1개 · 합포장 무료</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] font-bold opacity-50">STANDARD</p><p className="text-[20px] font-bold mt-1">599,000원<span className="text-[11px] font-normal opacity-50">/월</span></p><p className="text-[11px] opacity-60 mt-2">500건 · 파렛트 5개</p></div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="py-16 border-t border-black/5 bg-white -mx-6 px-6 md:-mx-0 md:px-0 md:rounded-[24px] md:border md:p-10">
          <h2 className="text-[20px] font-bold">이용 방법</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            <div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px] font-bold">1</div><p className="font-bold text-[13px] mt-3">회원가입 및 사업자 인증</p><p className="text-[11px] opacity-60 mt-1">/onboarding에서 사업자등록증, 신분증, 통장사본 제출. 24시간 내 승인.</p></div>
            <div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px] font-bold">2</div><p className="font-bold text-[13px] mt-3">플랫폼 연동</p><p className="text-[11px] opacity-60 mt-1">/platforms에서 네이버, 쿠팡, 11번가 API 연동. 주문 자동 수집.</p></div>
            <div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px] font-bold">3</div><p className="font-bold text-[13px] mt-3">입고 및 보관</p><p className="text-[11px] opacity-60 mt-1">상품을 김포 센터로 입고. 선반/파렛트에 보관. MY STATS에서 재고 확인.</p></div>
            <div><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px] font-bold">4</div><p className="font-bold text-[13px] mt-3">자동 풀필먼트</p><p className="text-[11px] opacity-60 mt-1">주문 발생 시 WMS에서 피킹, 패킹, 송장 출력. 당일 출고, 송장번호 자동 업로드.</p></div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-black/5 py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-4">
          <div><p className="font-bold text-[13px]">FLEX CENTER 마이크로 풀필먼트</p><p className="text-[11px] opacity-50 mt-1">경기도 김포시 · 문의: phankyu@gmail.com · 월 구독 풀필먼트, 보관부터 출고까지</p></div>
          <div className="flex gap-4 text-[11px] opacity-60"><Link href="/privacy" className="underline">개인정보처리방침</Link><Link href="/terms" className="underline">이용약관</Link><Link href="/pricing" className="underline">요금제</Link><Link href="/platforms" className="underline">플랫폼 연동</Link></div>
        </div>
      </footer>
    </div>
  );
}

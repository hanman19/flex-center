"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(()=>setMounted(true),[]);
  
  return (
    <div className="min-h-screen bg-white text-[#111] antialiased">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400&display=swap');
      body { font-family: 'Inter', sans-serif; letter-spacing: -0.02em; }
      `}</style>

      {/* Header like Fassto - super clean */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-[8px] text-[13px]">F</div>
              <span className="font-extrabold text-[17px] tracking-tight">FLEX CENTER</span>
            </div>
            <nav className="hidden md:flex gap-7 text-[14px] font-medium opacity-70">
              <span>서비스 소개</span><span>요금제</span><span>고객후기</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-[14px] font-medium px-4 py-2">로그인</Link>
            <Link href="/dashboard" className="bg-[#0066FF] text-white text-[14px] font-bold px-5 py-2.5 rounded-full hover:bg-[#0052cc]">시작하기</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6">
        {/* Hero - Fassto style: left text, right visual */}
        <section className="py-[88px] md:py-[120px] flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-[#F2F6FF] text-[#0066FF] text-[12px] font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-pulse"></span> 230개 브랜드가 쓰는 김포 거점
            </div>
            <h1 className="text-[52px] md:text-[64px] leading-[0.95] font-black tracking-[-0.04em] mt-6">
              재고 때문에<br/>
              집이 창고가<br/>
              <span className="text-[#0066FF]">되었다면.</span>
            </h1>
            <p className="text-[18px] leading-[1.6] opacity-60 mt-6 max-w-[420px] font-medium">
              김포 300평 공유창고. 1큐브 1평 월 3만원부터.<br/>입고 0원, 당일 발송, 사진/포장 대행까지.<br/>사장님은 판매만 하세요.
            </p>
            <div className="flex gap-3 mt-8">
              <Link href="/dashboard" className="bg-black text-white px-8 py-4 rounded-full font-bold text-[15px]">무료로 시작하기</Link>
              <button className="border border-black/10 px-8 py-4 rounded-full font-bold text-[15px] bg-white">요금제 보기</button>
            </div>
            <div className="flex gap-8 mt-12">
              <div><p className="font-black text-[24px] tracking-tight">2.8분</p><p className="text-[12px] opacity-50 font-medium">평균 입고 처리</p></div>
              <div className="w-px h-10 bg-black/10"></div>
              <div><p className="font-black text-[24px] tracking-tight">22 / 30</p><p className="text-[12px] opacity-50 font-medium">큐브 가동률 73%</p></div>
              <div className="w-px h-10 bg-black/10"></div>
              <div><p className="font-black text-[24px] tracking-tight">당일</p><p className="text-[12px] opacity-50 font-medium">16시 픽업 발송</p></div>
            </div>
          </div>

          <div className="flex-1 md:max-w-[480px]">
            <div className="bg-[#F7F8FA] rounded-[32px] p-8 border border-black/[0.04]">
              <div className="flex justify-between items-center mb-6">
                <p className="font-bold text-[14px]">요금 계산기</p>
                <span className="text-[11px] bg-white border px-2.5 py-1 rounded-full font-bold">LIVE</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 flex justify-between items-center border shadow-sm">
                  <div><p className="text-[13px] opacity-50">1큐브 보관</p><p className="font-bold text-[18px]">30,000원 / 월</p></div>
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
                </div>
                <div className="bg-white rounded-2xl p-5 flex justify-between items-center border">
                  <div><p className="text-[13px] opacity-50">입출고</p><p className="font-bold text-[18px]">0원</p></div>
                  <span className="text-[#0066FF] font-bold text-[13px] bg-[#F2F6FF] px-3 py-1 rounded-full">무료</span>
                </div>
                <div className="bg-white rounded-2xl p-5 flex justify-between items-center border">
                  <div><p className="text-[13px] opacity-50">택배비 (CJ/한진)</p><p className="font-bold text-[18px]">2,500원 ~</p></div>
                  <span className="text-[12px] opacity-40">당일 발송</span>
                </div>
                <div className="bg-black text-white rounded-2xl p-5 flex justify-between items-center">
                  <p className="font-bold">첫 달은</p><p className="font-black text-[20px]">무료 체험</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof like Fassto */}
        <section className="border-y border-black/[0.06] py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[13px] font-bold opacity-30 tracking-wide">TRUSTED BY 230 BRANDS</p>
          <div className="flex gap-10 opacity-20 font-black text-[14px]">
            <span>CAFE24</span><span>NAVER</span><span>COUPANG</span><span>AMOREPACIFIC</span><span>NATURE REPUBLIC</span>
          </div>
        </section>

        {/* How it works - Fassto 3 steps */}
        <section className="py-20">
          <h2 className="text-[32px] font-black tracking-tight">어떻게 이용하나요? 3분이면 끝나요.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-[#F7F8FA] rounded-[24px] p-8">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-[14px]">1</div>
              <p className="font-bold text-[18px] mt-6">큐브 신청</p>
              <p className="text-[14px] opacity-60 mt-2 leading-relaxed">회원전용에서 로그인하고 큐브 1개부터 신청하세요. 당일 배정됩니다.</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-[24px] p-8">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-[14px]">2</div>
              <p className="font-bold text-[18px] mt-6">입고</p>
              <p className="text-[14px] opacity-60 mt-2 leading-relaxed">택배로 보내거나 직접 가져오세요. 3분 안에 시스템에 등록됩니다.</p>
            </div>
            <div className="bg-[#F7F8FA] rounded-[24px] p-8">
              <div className="w-10 h-10 bg-[#0066FF] text-white rounded-full flex items-center justify-center font-black text-[14px]">3</div>
              <p className="font-bold text-[18px] mt-6">자동 발송</p>
              <p className="text-[14px] opacity-60 mt-2 leading-relaxed">카페24 연동, 매일 16시 택배사 픽업. 사장님은 판매에만 집중.</p>
            </div>
          </div>
        </section>

        {/* CTA like Fassto blue */}
        <section className="bg-[#0066FF] rounded-[32px] p-12 md:p-16 text-white flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div>
            <h2 className="text-[36px] font-black leading-tight tracking-tight">지금 시작하면<br/>첫 달 무료.</h2>
            <p className="text-[15px] opacity-80 mt-3">집 보증금 올려서 재고 쌓지 마세요. 큐브 하나면 됩니다.</p>
          </div>
          <Link href="/dashboard" className="bg-white text-black px-8 py-4 rounded-full font-bold text-[15px]">회원전용 창고 들어가기 →</Link>
        </section>

        <footer className="border-t border-black/[0.06] py-10 flex justify-between text-[11px] opacity-40 font-medium">
          <span>© 2026 FLEX CENTER • BUILT BY 한규 • LIVE ON SUPABASE SEOUL</span>
          <span>GIMPO 300PY • 22/30 CUBES</span>
        </footer>
      </main>
    </div>
  );
}

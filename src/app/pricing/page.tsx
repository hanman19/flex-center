"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    id:"STARTER",
    name:"STARTER",
    orders:"월 10건",
    price:"26,900",
    perOrder:"2,690원/건",
    storage:"선반 1개 포함\n(300*450*250, 1 SKU)",
    badge:"BETA",
    popular:false,
  },
  {
    id:"LITE",
    name:"LITE",
    orders:"월 100건",
    price:"149,000",
    perOrder:"1,490원/건",
    storage:"파렛트 1개 포함\n(1.1*1.1*1.8m)",
    badge:"ORIGINAL",
    popular:true,
  },
  {
    id:"STANDARD",
    name:"STANDARD",
    orders:"월 500건",
    price:"599,000",
    perOrder:"1,198원/건",
    storage:"파렛트 5개 포함",
    badge:null,
    popular:false,
  },
  {
    id:"GOLD",
    name:"GOLD",
    orders:"월 1,000건",
    price:"1,190,000",
    perOrder:"1,190원/건",
    storage:"파렛트 10개 포함",
    badge:null,
    popular:false,
  },
  {
    id:"PLATINUM",
    name:"PLATINUM",
    orders:"월 3,000건",
    price:"3,290,000",
    perOrder:"1,096원/건",
    storage:"파렛트 25개 포함",
    badge:null,
    popular:false,
  },
  {
    id:"VIP",
    name:"VIP",
    orders:"월 5,000건",
    price:"5,349,000",
    perOrder:"1,069원/건",
    storage:"파렛트 40개 포함",
    badge:null,
    popular:false,
  },
];

export default function PricingPage() {
  const [selected, setSelected] = useState("VIP");

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#111]">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-lg">F</div>
            <span className="font-black">FLEX CENTER</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/dashboard" className="text-[11px] md:text-[12px] border px-3 md:px-4 py-2 rounded-full">내 창고</Link>
            <Link href="/admin" className="text-[11px] md:text-[12px] bg-black text-white px-3 md:px-4 py-2 rounded-full">사장님</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div>
          <p className="text-[12px] tracking-widest opacity-40">PRICING</p>
          <h1 className="text-[28px] md:text-[42px] font-black tracking-tight leading-none mt-1">요금제</h1>
          <p className="text-[12px] md:text-[13px] opacity-50 mt-3">월 기준 · 부가세 별도 · TOP BIG 실제 평균 비용 베이스</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-6 md:mt-8 border rounded-[20px] overflow-hidden bg-white">
          {PLANS.map((plan)=>(
            <div key={plan.id} className={`p-5 md:p-7 border-b md:border-b-0 md:border-r last:border-r-0 relative flex flex-col ${plan.popular ? 'ring-2 ring-[#0066FF] ring-inset bg-[#fafbff]' : ''}`}>
              {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0066FF] text-white text-[9px] px-3 py-1 rounded-full font-bold whitespace-nowrap">MOST POPULAR</div>}
              
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-[13px] md:text-[14px] tracking-widest whitespace-nowrap">{plan.name}</span>
                    {plan.badge && <span className={`text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${plan.badge==='ORIGINAL' ? 'bg-[#0066FF] text-white' : 'bg-black text-white'}`}>{plan.badge}</span>}
                  </div>
                  <p className="text-[11px] md:text-[12px] opacity-50 mt-1">{plan.orders}</p>
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-[#0066FF] text-right leading-tight whitespace-nowrap">PER ORDER<br/>{plan.perOrder}</span>
              </div>

              <p className="text-[26px] md:text-[32px] font-black mt-3 md:mt-4 tracking-tight leading-none">{plan.price}<span className="text-[12px] md:text-[14px] font-medium">원</span></p>
              
              <p className="text-[10px] md:text-[11px] opacity-60 mt-2 leading-snug whitespace-pre-wrap break-words min-h-[32px]">
                {plan.storage}
              </p>

              <div className="mt-4 space-y-1 border-t pt-4">
                <p className="text-[11px] flex gap-2"><span className="text-[#0066FF] shrink-0">✓</span> <span className="break-keep">합포장 3개 무료 포함</span></p>
                <p className="text-[11px] flex gap-2"><span className="text-[#0066FF] shrink-0">✓</span> <span className="break-keep">바코드 라벨링 무료</span></p>
                <p className="text-[11px] flex gap-2"><span className="text-[#0066FF] shrink-0">✓</span> <span className="break-keep">일반 포장 무료</span></p>
              </div>

              <button 
                onClick={()=>setSelected(plan.id)}
                className={`w-full mt-auto pt-4 md:pt-6 rounded-full py-3 text-[12px] md:text-[13px] font-bold transition border mt-5 ${selected===plan.id ? 'bg-black text-white border-black' : 'bg-white border-black text-black hover:bg-black hover:text-white'}`}>
                {selected===plan.id ? '선택됨 ✓' : `${plan.name} 선택하기 →`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-black text-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-black text-[18px] md:text-[20px]">{selected} 플랜 선택됨</p>
            <p className="text-[12px] md:text-[13px] opacity-60 mt-1 break-keep">선택한 요금제로 온보딩을 시작합니다. 사업자 정보를 입력하세요.</p>
          </div>
          <Link href={`/onboarding?plan=${selected}`} className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-[13px] md:text-[14px] whitespace-nowrap">사업자 정보 입력하고 시작하기 →</Link>
        </div>

        <div className="mt-8 text-[11px] opacity-40 leading-relaxed break-keep">
          <p>※ 모든 요금제에 합포장 3개 무료, 바코드 라벨링 무료, 일반 포장(박스+완충재+인쇄) 무료 포함</p>
          <p>※ 보관 초과 시 파렛트 1.1*1.1*1.8m 기준, 혼적 3개 허용, 선반 1석 1SKU 혼적 불가</p>
          <p>※ 60일 이상 장기 보관 시 50% 할증, 야간/주말 할증 별도 (근로기준법 제56조)</p>
        </div>
      </main>
    </div>
  );
}

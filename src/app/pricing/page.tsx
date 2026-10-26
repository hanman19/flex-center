"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  { id:"STARTER", name:"STARTER", orders:"월 10건", price:"26,900", perOrder:"2,690원", storage:"선반 1개", detail:"300×450×250 / 1 SKU", badge:"BETA", popular:false },
  { id:"LITE", name:"LITE", orders:"월 100건", price:"149,000", perOrder:"1,490원", storage:"파렛트 1개", detail:"1.1×1.1×1.8m", badge:"ORIGINAL", popular:true },
  { id:"STANDARD", name:"STANDARD", orders:"월 500건", price:"599,000", perOrder:"1,198원", storage:"파렛트 5개", detail:"", badge:null, popular:false },
  { id:"GOLD", name:"GOLD", orders:"월 1,000건", price:"1,190,000", perOrder:"1,190원", storage:"파렛트 10개", detail:"", badge:null, popular:false },
  { id:"PLATINUM", name:"PLATINUM", orders:"월 3,000건", price:"3,290,000", perOrder:"1,096원", storage:"파렛트 25개", detail:"", badge:null, popular:false },
  { id:"VIP", name:"VIP", orders:"월 5,000건", price:"5,349,000", perOrder:"1,069원", storage:"파렛트 40개", detail:"", badge:null, popular:false },
];

export default function PricingPage() {
  const [selected, setSelected] = useState("VIP");
  const [animating, setAnimating] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setAnimating(id);
    setSelected(id);
    setTimeout(()=>setAnimating(null), 400);
    // 햅틱 느낌
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      (navigator as any).vibrate(30);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111] font-sans">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
            <span className="font-semibold tracking-tight">FLEX CENTER</span>
          </Link>
          <div className="flex gap-2">
            <Link href="/dashboard" className="text-[13px] px-4 py-2 rounded-full border border-black/10 hover:bg-black hover:text-white transition">내 창고</Link>
            <Link href="/admin" className="text-[13px] px-4 py-2 rounded-full bg-black text-white">사장님</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="pt-16 md:pt-24 pb-12">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-widest border border-black/10 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            BETA • 실제 발송 데이터 기반
          </div>
          <h1 className="text-[36px] md:text-[56px] font-[800] tracking-[-0.03em] leading-[0.95] mt-6">필요한 만큼만,<br/>투명하게.</h1>
          <p className="text-[15px] md:text-[17px] opacity-60 mt-5 max-w-[520px] leading-relaxed">합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함. 숨겨진 비용 없습니다.</p>
        </div>

        {/* Plans Grid - Fixed black line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[1px] md:bg-transparent">
          {PLANS.map((plan)=>{
            const isSelected = selected === plan.id;
            const isAnimating = animating === plan.id;
            
            return (
              <div 
                key={plan.id} 
                onClick={()=>handleSelect(plan.id)}
                className={`
                  group relative bg-white p-7 md:p-8 rounded-[24px] md:rounded-[20px] flex flex-col cursor-pointer
                  border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${isSelected 
                    ? 'border-black shadow-[0_0_0_1px_black,0_20px_60px_rgba(0,0,0,0.15)] scale-[1.02] z-10' 
                    : 'border-black/10 hover:border-black/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1'
                  }
                  ${plan.popular && !isSelected ? 'md:ring-1 md:ring-blue-600/20 md:shadow-[0_10px_40px_rgba(37,99,235,0.12)]' : ''}
                  ${isAnimating ? 'scale-[0.98]' : ''}
                `}
              >
                {/* MOST POPULAR Badge - Fixed position, no black line */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white text-[10px] tracking-widest px-3.5 py-1 rounded-full font-semibold shadow-[0_4px_12px_rgba(37,99,235,0.3)] z-20">
                    MOST POPULAR
                  </div>
                )}

                {/* Selection Indicator */}
                <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-black border-black scale-110' : 'border-black/15 bg-white group-hover:border-black/30'}`}>
                  {isSelected && <span className="text-white text-[12px] font-bold">✓</span>}
                </div>

                <div className="flex justify-between items-start pr-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13px] tracking-widest">{plan.name}</span>
                      {plan.badge && <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-widest ${plan.badge==='ORIGINAL' ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}>{plan.badge}</span>}
                    </div>
                    <p className="text-[13px] opacity-40 mt-1">{plan.orders}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] opacity-40">건당</p>
                    <p className="text-[12px] font-semibold text-black/70">{plan.perOrder}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className={`text-[32px] font-[700] tracking-tight leading-none transition-transform duration-300 ${isAnimating ? 'scale-105' : ''} ${isSelected ? 'text-black' : ''}`}>
                    {plan.price}<span className="text-[14px] font-normal opacity-60 ml-1">원 / 월</span>
                  </p>
                  <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors ${isSelected ? 'bg-black text-white' : 'bg-black/[0.04]'}`}>
                    <span className="text-[11px] font-medium">{plan.storage}</span>
                    {plan.detail && <span className={`text-[10px] ${isSelected ? 'opacity-60' : 'opacity-40'}`}>· {plan.detail}</span>}
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-[12px]"><span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'bg-black text-white' : 'bg-black/5'}`}>✓</span> 합포장 3개 무료</div>
                  <div className="flex items-center gap-2 text-[12px]"><span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'bg-black text-white' : 'bg-black/5'}`}>✓</span> 바코드 라벨링 무료</div>
                  <div className="flex items-center gap-2 text-[12px]"><span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'bg-black text-white' : 'bg-black/5'}`}>✓</span> 일반 포장 무료</div>
                </div>

                <div className={`mt-8 w-full rounded-full py-3.5 text-[13px] font-semibold transition-all duration-300 text-center
                  ${isSelected 
                    ? 'bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)]' 
                    : 'bg-white border border-black/10 group-hover:bg-black group-hover:text-white group-hover:border-black'
                  }
                  ${isAnimating ? 'scale-95' : 'scale-100'}
                `}>
                  {isSelected ? '선택됨 ✓' : `${plan.name} 선택`}
                </div>

                {/* Subtle glow for selected */}
                {isSelected && <div className="absolute inset-0 rounded-[24px] md:rounded-[20px] bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none" />}
              </div>
            );
          })}
        </div>

        {/* Details sections - keep simple */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-black/5 pt-16">
          <div className="md:col-span-5">
            <p className="text-[11px] tracking-widest opacity-30">STORAGE & FEES</p>
            <h2 className="text-[26px] md:text-[32px] font-semibold tracking-tight leading-tight mt-3">보관은 필요한 만큼,<br/>초과도 합리적으로.</h2>
          </div>
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {name:"STARTER", pallets:"선반 1개", over:"초과 불가", min:"최소 1만원"},
                {name:"LITE", pallets:"파렛트 1개", over:"3만원 / 월", min:"최소 5만원"},
                {name:"STANDARD", pallets:"파렛트 5개", over:"3만원 / 월", min:"최소 15만원"},
                {name:"GOLD", pallets:"파렛트 10개", over:"2.5만원 / 월", min:"최소 25만원"},
                {name:"PLATINUM", pallets:"파렛트 25개", over:"2만원 / 월", min:"최소 50만원"},
                {name:"VIP", pallets:"파렛트 40개", over:"2만원 / 월", min:"최소 80만원"},
              ].map((s)=>(
                <div key={s.name} className={`bg-white border rounded-[16px] p-5 transition-all ${selected===s.name ? 'border-black ring-1 ring-black' : 'border-black/5'}`}>
                  <p className="text-[11px] font-semibold tracking-widest opacity-40">{s.name}</p>
                  <p className="text-[13px] font-medium mt-2">{s.pallets}</p>
                  <p className="text-[12px] opacity-60 mt-1">{s.over}</p>
                  <p className="text-[11px] mt-3 inline-block bg-black/5 px-2 py-1 rounded-full">{s.min}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pb-32 border-t border-black/5 pt-16">
          <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between">
            <div>
              <p className="text-[11px] tracking-widest opacity-30">NIGHT & WEEKEND</p>
              <h2 className="text-[22px] md:text-[26px] font-semibold tracking-tight mt-3">야간·주말, 정해진 기준대로만.</h2>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] px-3 py-1.5 rounded-full bg-black text-white">평일 주간 09-18시 포함</span>
              <span className="text-[11px] px-3 py-1.5 rounded-full border border-black/10">연장·야간·휴일 +300~600원</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-[1px] bg-black/10 rounded-[16px] overflow-hidden p-[1px]">
            {[
              {k:"평일 주간", t:"09-18", p:"포함"},
              {k:"평일 연장", t:"18-22", p:"+300원"},
              {k:"야간", t:"22-06", p:"+300원"},
              {k:"연장+야간", t:"22-24", p:"+600원"},
              {k:"주말 주간", t:"09-18", p:"+300원"},
              {k:"주말 야간", t:"22-06", p:"+600원"},
            ].map((i)=>(
              <div key={i.k} className="bg-white p-4 text-center">
                <p className="text-[11px] font-medium">{i.k}</p>
                <p className="text-[11px] opacity-40 mt-1">{i.t}</p>
                <p className={`text-[13px] font-semibold mt-2 ${i.p==='포함' ? 'text-green-600' : 'text-orange-600'}`}>{i.p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[560px]">
          <div className="bg-black text-white rounded-full p-2 flex items-center justify-between shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="pl-6">
              <p className="text-[11px] opacity-50">선택한 플랜</p>
              <p className="text-[15px] font-semibold -mt-0.5 transition-all">{selected} · {PLANS.find(p=>p.id===selected)?.price}원</p>
            </div>
            <Link href={`/onboarding?plan=${selected}`} className="bg-white text-black px-6 py-3 rounded-full text-[13px] font-semibold hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all">
              시작하기 →
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

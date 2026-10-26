"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  { id:"STARTER", name:"STARTER", orders:"월 10건", price:"26,900", perOrder:"2,690원/건", storage:"선반 1개 포함\n(300*450*250, 1 SKU)", badge:"BETA", popular:false },
  { id:"LITE", name:"LITE", orders:"월 100건", price:"149,000", perOrder:"1,490원/건", storage:"파렛트 1개 포함\n(1.1*1.1*1.8m)", badge:"ORIGINAL", popular:true },
  { id:"STANDARD", name:"STANDARD", orders:"월 500건", price:"599,000", perOrder:"1,198원/건", storage:"파렛트 5개 포함", badge:null, popular:false },
  { id:"GOLD", name:"GOLD", orders:"월 1,000건", price:"1,190,000", perOrder:"1,190원/건", storage:"파렛트 10개 포함", badge:null, popular:false },
  { id:"PLATINUM", name:"PLATINUM", orders:"월 3,000건", price:"3,290,000", perOrder:"1,096원/건", storage:"파렛트 25개 포함", badge:null, popular:false },
  { id:"VIP", name:"VIP", orders:"월 5,000건", price:"5,349,000", perOrder:"1,069원/건", storage:"파렛트 40개 포함", badge:null, popular:false },
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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-[12px] tracking-widest opacity-40">04</p>
            <h1 className="text-[28px] md:text-[42px] font-black tracking-tight leading-none mt-1">요금제</h1>
            <div className="flex gap-2 mt-3 items-center">
              <span className="text-[10px] bg-[#0066FF] text-white px-2 py-1 rounded-full font-bold">BETA</span>
              <span className="text-[12px] opacity-60">월 기준 · 부가세 별도</span>
            </div>
            <p className="text-[12px] md:text-[13px] opacity-50 mt-2 break-keep">TOP BIG Pricing. 0건/주말 발송 반영된 실제 평균 비용 베이스 요금표.</p>
          </div>
          <div className="bg-[#E8F5E9] border border-green-200 rounded-full px-4 py-2 text-[11px] md:text-[12px] break-keep">
            <span className="w-2 h-2 bg-green-500 inline-block rounded-full mr-2"></span>
            모든 요금제에 3개월 무료 합포장 포함, 바코드 라벨링 무료, 일반 포장 무료 (박스+완충재+인쇄)
          </div>
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
              <p className="text-[10px] md:text-[11px] opacity-60 mt-2 leading-snug whitespace-pre-wrap break-words min-h-[32px]">{plan.storage}</p>
              <div className="mt-4 space-y-1 border-t pt-4">
                <p className="text-[11px] flex gap-2"><span className="text-[#0066FF] shrink-0">✓</span> <span className="break-keep">합포장 3개 무료 포함</span></p>
                <p className="text-[11px] flex gap-2"><span className="text-[#0066FF] shrink-0">✓</span> <span className="break-keep">바코드 라벨링 무료</span></p>
                <p className="text-[11px] flex gap-2"><span className="text-[#0066FF] shrink-0">✓</span> <span className="break-keep">일반 포장 무료</span></p>
              </div>
              <button onClick={()=>setSelected(plan.id)} className={`w-full rounded-full py-3 text-[12px] md:text-[13px] font-bold transition border mt-5 ${selected===plan.id ? 'bg-black text-white border-black' : 'bg-white border-black text-black hover:bg-black hover:text-white'}`}>
                {selected===plan.id ? '선택됨 ✓' : `${plan.name} 선택하기 →`}
              </button>
            </div>
          ))}
        </div>

        {/* 아래 상세표 - 원래 있던 거 복구 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10 md:mt-12">
          <div className="space-y-6">
            <div className="bg-white border rounded-[16px] p-6">
              <h3 className="font-black text-[14px]">01 합포장 추가 <span className="ml-2 text-[10px] bg-black/5 px-2 py-1 rounded-full">FREE 3 · SKU 기준</span></h3>
              <div className="mt-4 space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="opacity-60">3개까지</span><span className="font-bold text-[#0066FF]">무료</span></div>
                <div className="flex justify-between"><span className="opacity-60">4개부터 동종</span><span className="font-bold">100원/개</span></div>
                <div className="flex justify-between"><span className="opacity-60">4개부터 이종</span><span className="font-bold">200원/개</span></div>
                <p className="text-[11px] opacity-40 mt-3 leading-snug break-keep">SKU 기준, 평균 2.3개로 대부분 무료 구간. 이종은 바코드 구분 작업 포함.</p>
              </div>
            </div>

            <div className="bg-white border rounded-[16px] p-6">
              <h3 className="font-black text-[14px]">04 특수 처리</h3>
              <div className="mt-4 space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="opacity-60">반품 재입고/재포장</span><span className="font-bold">500원/건</span></div>
                <div className="flex justify-between"><span className="opacity-60">반품률 15-40% 상회 (패션 기준): 검수+재포장 포함</span><span></span></div>
                <div className="flex justify-between"><span className="opacity-60">특수 포장</span><span className="font-bold">500원/건</span></div>
                <div className="flex justify-between"><span className="opacity-60">택기</span><span className="font-bold">300원/건</span></div>
              </div>
            </div>

            <div className="bg-[#F1F8E9] border border-green-200 rounded-[16px] p-6">
              <h3 className="font-black text-[13px]">05 무료 포함</h3>
              <div className="mt-3 space-y-2 text-[12px]">
                <p>✅ 바코드 라벨링 무료</p>
                <p>✅ 입고 검수 무료 (선별)</p>
                <p>✅ 일반 포장 박스+완충재 무료</p>
                <p>✅ 인쇄비 무료</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-[16px] p-6">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-[13px]">02 보관 초과비용</h3>
                <span className="text-[10px] opacity-40">10 / 100 / 500 / 1000 / 3000 / 5000 원본</span>
              </div>
              <p className="text-[10px] opacity-50 mt-2 leading-snug break-keep">파렛트 1.1*1.1*1.8m - 혼적 3개 허용, 선반 1석 1SKU 혼적 불가. 보관시작 49일 고정, 파렛트 10개 사용시 초과 285,000+장치 75,000원 구조, 60일 60% 사실</p>
              <div className="mt-4 overflow-x-auto -mx-1">
                <table className="w-full text-[11px] min-w-[480px]">
                  <thead><tr className="bg-black/5"><th className="p-2 text-left">요금제</th><th className="p-2 text-left">포함 보관량</th><th className="p-2">초과 파렛트</th><th className="p-2">장기 보관 60일+</th><th className="p-2">최소 보관료</th></tr></thead>
                  <tbody className="divide-y">
                    <tr><td className="p-2 font-bold">STARTER 10건</td><td className="p-2">선반 1개 포함</td><td className="p-2 text-center">-</td><td className="p-2 text-center">60일+ 50% 할증</td><td className="p-2 text-center font-bold text-[#0066FF]">10,000원</td></tr>
                    <tr><td className="p-2 font-bold">LITE 100건</td><td className="p-2">파렛트 1개 포함</td><td className="p-2 text-center">30,000원/월</td><td className="p-2 text-center">60일+ 50% 할증</td><td className="p-2 text-center font-bold text-[#0066FF]">50,000원</td></tr>
                    <tr><td className="p-2 font-bold">STANDARD 500건</td><td className="p-2">파렛트 5개 포함</td><td className="p-2 text-center">30,000원/월</td><td className="p-2 text-center">60일+ 50% 할증</td><td className="p-2 text-center font-bold text-[#0066FF]">150,000원</td></tr>
                    <tr><td className="p-2 font-bold">GOLD 1,000건</td><td className="p-2">파렛트 10개 포함</td><td className="p-2 text-center">25,000원/월</td><td className="p-2 text-center">60일+ 50% 할증</td><td className="p-2 text-center font-bold text-[#0066FF]">250,000원</td></tr>
                    <tr><td className="p-2 font-bold">PLATINUM 3,000건</td><td className="p-2">파렛트 25개 포함</td><td className="p-2 text-center">20,000원/월</td><td className="p-2 text-center">60일+ 50% 할증</td><td className="p-2 text-center font-bold text-[#0066FF]">500,000원</td></tr>
                    <tr><td className="p-2 font-bold">VIP 5,000건</td><td className="p-2">파렛트 40개 포함</td><td className="p-2 text-center">20,000원/월</td><td className="p-2 text-center">60일+ 50% 할증</td><td className="p-2 text-center font-bold text-[#0066FF]">800,000원</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border rounded-[16px] p-6">
              <h3 className="font-black text-[13px]">03 야간/주말 할증 <span className="ml-2 text-[9px] bg-black text-white px-2 py-0.5 rounded-full">ORIGINAL</span></h3>
              <div className="overflow-x-auto -mx-1 mt-4">
                <table className="w-full text-[11px] min-w-[480px]">
                  <thead><tr className="bg-black text-white"><th className="p-2">구분</th><th className="p-2">시간대</th><th className="p-2">법적 근거</th><th className="p-2">추가 발송</th></tr></thead>
                  <tbody className="divide-y">
                    <tr><td className="p-2">평일 주간</td><td className="p-2">09:00-18:00</td><td className="p-2">기본 (근로기준법)</td><td className="p-2 text-[#0066FF]">포함 (0원)</td></tr>
                    <tr><td className="p-2">평일 연장</td><td className="p-2">18:00-22:00</td><td className="p-2">연장 1.5배 (제56조)</td><td className="p-2 text-[#FF8F00] font-bold">+300원</td></tr>
                    <tr><td className="p-2">야간</td><td className="p-2">22:00-06:00</td><td className="p-2">야간 1.5배 (제56조)</td><td className="p-2 text-[#FF8F00] font-bold">+300원</td></tr>
                    <tr><td className="p-2">연장+야간</td><td className="p-2">22:00-24:00</td><td className="p-2">합산 2배 (제56조)</td><td className="p-2 text-[#FF8F00] font-bold">+600원</td></tr>
                    <tr><td className="p-2">주말/공휴일 주간</td><td className="p-2">09:00-18:00</td><td className="p-2">휴일 1.5배 (제56조)</td><td className="p-2 text-[#FF8F00] font-bold">+300원</td></tr>
                    <tr><td className="p-2">주말/공휴일 야간</td><td className="p-2">22:00-06:00</td><td className="p-2">휴일+야간 2배 (제56조)</td><td className="p-2 text-[#FF8F00] font-bold">+600원</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-[#FFF8E1] rounded-lg p-3 text-[11px]">
                <p className="font-bold">EXAMPLE</p>
                <p className="opacity-70 mt-1 break-keep">예시: 토요일 밤 23시 10건 출고 → 기본 건수 차감 + 10건*600원=6,000원 추가. 연장+야간 합산 2배.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-black text-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-black text-[18px] md:text-[20px]">{selected} 플랜 선택됨</p>
            <p className="text-[12px] md:text-[13px] opacity-60 mt-1 break-keep">선택한 요금제로 온보딩을 시작합니다. 사업자 정보를 입력하세요.</p>
          </div>
          <Link href={`/onboarding?plan=${selected}`} className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-[13px] md:text-[14px] whitespace-nowrap">사업자 정보 입력하고 시작하기 →</Link>
        </div>
      </main>
    </div>
  );
}

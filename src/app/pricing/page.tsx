"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  { id: "STARTER", name: "STARTER", quota: "월 10건", quotaNum: 10, price: "26,900", over: "1,600", overRange: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개", size: "300×450×250 / 1 SKU", badge: "BETA" },
  { id: "LITE", name: "LITE", quota: "월 100건", quotaNum: 100, price: "149,000", over: "1,400", overRange: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", size: "1.1×1.1×1.8m", badge: "ORIGINAL", popular: true },
  { id: "STANDARD", name: "STANDARD", quota: "월 500건", quotaNum: 500, price: "599,000", over: "1,200", overRange: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개", size: "" },
  { id: "GOLD", name: "GOLD", quota: "월 1,000건", quotaNum: 1000, price: "1,190,000", over: "1,150", overRange: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개", size: "" },
  { id: "PLATINUM", name: "PLATINUM", quota: "월 3,000건", quotaNum: 3000, price: "3,290,000", over: "1,100", overRange: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개", size: "" },
  { id: "VIP", name: "VIP", quota: "월 5,000건", quotaNum: 5000, price: "5,349,000", over: "1,050", overRange: "5001건~", switchText: "대량 협의·규모 경제", storage: "파렛트 40개", size: "" },
];

export default function PricingPage() {
  const [selected, setSelected] = useState("LITE");

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span></Link>
          <div className="flex gap-2"><Link href="/" className="text-[12px] px-4 py-2 rounded-full border border-black/10">홈</Link><Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full bg-black text-white">회원전용 →</Link></div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="inline-flex items-center gap-2 text-[11px] border border-black/10 rounded-full px-3 py-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>BETA · 실제 발송 데이터 기반</div>
        <h1 className="mt-6 text-[40px] font-black leading-[0.9] tracking-[-0.04em]">필요한 만큼만,<br/>투명하게.</h1>
        <p className="mt-4 text-[14px] opacity-60 max-w-[520px]">합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함. 건당 단가 없이 월 요금 + 초과분만.</p>

        {/* 6개 카드 - 건당 단가 없음! */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {PLANS.map(p=>(
            <div key={p.id} className={`rounded-[20px] p-6 border-2 bg-white relative transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${selected===p.id ? "border-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]" : "border-black/5"} ${p.popular ? "pt-8" : ""}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full">MOST POPULAR</div>}
              <div className="flex items-start justify-between">
                <div><div className="flex items-center gap-2"><span className="font-bold text-[12px] tracking-widest">{p.name}</span>{p.badge && <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{p.badge}</span>}</div><p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div>
                <button onClick={()=>setSelected(p.id)} className={`w-6 h-6 rounded-full border flex items-center justify-center ${selected===p.id ? "bg-black text-white border-black" : "border-black/10"}`}>{selected===p.id && "✓"}</button>
              </div>
              <p className="mt-6 text-[28px] font-black">{p.price}<span className="text-[14px] font-normal opacity-50"> 원 / 월</span></p>
              <div className="mt-3 flex gap-2"><span className="bg-black text-white text-[11px] px-3 py-1 rounded-full font-bold">{p.storage}</span>{p.size && <span className="text-[11px] opacity-50">{p.size}</span>}</div>
              <div className="mt-4 bg-[#fafaf8] border border-black/5 rounded-[12px] p-3"><p className="text-[10px] opacity-40">초과 건당</p><p className="text-[13px] font-black mt-1">{p.over}원 <span className="font-normal opacity-50 text-[11px]">({p.overRange})</span></p><p className="text-[10px] opacity-50 mt-1">→ {p.switchText}</p></div>
              <div className="mt-5 space-y-2 text-[12px]"><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>합포장 3개 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>바코드 라벨링 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>일반 포장 무료</p></div>
              <button onClick={()=>setSelected(p.id)} className={`mt-6 w-full py-3 rounded-full font-bold text-[12px] ${selected===p.id ? "bg-black text-white" : "border border-black/10"}`}>{selected===p.id ? "선택됨 ✓" : `${p.name} 선택`}</button>
            </div>
          ))}
        </div>

        {/* 상세 요금제 표 - 요금제 페이지에만! */}
        <div className="mt-16">
          <h2 className="font-black text-[20px]">상세 요금제 - 초과 건당 포함</h2>
          <p className="text-[12px] opacity-60 mt-2">초과 시 건당 요금으로 자동 청구. Toss Payments Metered Billing으로 투명하게.</p>
          <div className="mt-6 overflow-auto rounded-[16px] border border-black/5 bg-white">
            <table className="w-full text-[12px]">
              <thead className="bg-black text-white text-[11px]"><tr><th className="text-left py-3 px-4">요금제</th><th className="text-left">조합 건수</th><th className="text-left">월 요금</th><th className="text-left"><span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px]">초과 건당</span></th><th className="text-left">자동 전환 안내</th><th className="text-left">보관 포함</th></tr></thead>
              <tbody>
                {PLANS.map(p=>(
                  <tr key={p.id} className={`border-b border-black/5 hover:bg-[#fafaf8] ${selected===p.id ? "bg-[#fafaf8] font-bold border-l-4 border-l-black" : ""}`}>
                    <td className="py-3 px-4 flex items-center gap-2">{p.name} {p.badge && <span className="bg-black text-white text-[8px] px-1.5 py-0.5 rounded-full">{p.badge}</span>}</td>
                    <td>{p.quota}</td>
                    <td>{p.price}원</td>
                    <td><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${selected===p.id ? "bg-black text-white" : "bg-green-50 text-green-700 border border-green-200"}`}>{p.over}원 ({p.overRange}) ↓</span></td>
                    <td className="text-[11px] opacity-70">{p.switchText}</td>
                    <td className="font-bold">{p.storage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]"><span className="bg-black text-white px-3 py-1.5 rounded-full font-bold">Toss Payments Metered Billing 지원</span><span className="bg-white border border-black/10 px-3 py-1.5 rounded-full">초과분은 일할 계산, 다음달 청구</span><span className="bg-white border border-black/10 px-3 py-1.5 rounded-full opacity-60">예: LITE 120건 = 149,000 + 20×1,400 = 177,000원</span></div>
        </div>

        {/* STORAGE & NIGHT */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-[13px]">STORAGE & FEES - 보관은 필요한 만큼</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {PLANS.map(p=>(
                <div key={p.id} className={`rounded-[12px] p-3 border text-[11px] ${selected===p.id ? "border-black bg-black text-white" : "bg-white border-black/5"}`}>
                  <p className="opacity-60">{p.name}</p><p className="font-bold mt-1 text-[13px]">{p.storage}</p><p className="opacity-60 mt-1 text-[10px]">{p.id==="STARTER" ? "초과 불가" : p.id==="LITE" ? "파렛트 1개, 초과 3만원/월" : p.id==="STANDARD" ? "파렛트 5개, 초과 3만원/월" : p.id==="GOLD" ? "파렛트 10개, 초과 2.5만원/월" : p.id==="PLATINUM" ? "파렛트 25개, 초과 2만원/월" : "파렛트 40개, 초과 2만원/월"}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] opacity-50">보관료: 파렛트당 2~3만원/월, 최소 1만~80만원. STARTER는 선반 1개 초과 불가.</p>
          </div>
          <div>
            <h3 className="font-bold text-[13px]">NIGHT & WEEKEND - 야간·주말, 정해진 기준대로만</h3>
            <div className="mt-4 grid grid-cols-6 gap-0 border border-black/5 rounded-[12px] overflow-hidden bg-white text-[11px] text-center">
              <div className="py-4 border-r border-black/5"><p className="opacity-50">평일 주간</p><p className="text-[10px] opacity-40">09-18</p><p className="mt-2 font-bold text-green-600">포함</p></div>
              <div className="py-4 border-r border-black/5"><p className="opacity-50">평일 연장</p><p className="text-[10px] opacity-40">18-22</p><p className="mt-2 font-bold text-amber-600">+300원</p></div>
              <div className="py-4 border-r border-black/5"><p className="opacity-50">야간</p><p className="text-[10px] opacity-40">22-06</p><p className="mt-2 font-bold text-amber-600">+300원</p></div>
              <div className="py-4 border-r border-black/5"><p className="opacity-50">연장+야간</p><p className="text-[10px] opacity-40">22-24</p><p className="mt-2 font-bold text-red-600">+600원</p></div>
              <div className="py-4 border-r border-black/5"><p className="opacity-50">주말 주간</p><p className="text-[10px] opacity-40">09-18</p><p className="mt-2 font-bold text-amber-600">+300원</p></div>
              <div className="py-4"><p className="opacity-50">주말 야간</p><p className="text-[10px] opacity-40">22-06</p><p className="mt-2 font-bold text-red-600">+600원</p></div>
            </div>
            <p className="mt-3 text-[11px] opacity-50">야간/주말 출고 시 건당 추가. 예: LITE 100건 중 20건 야간 = 149,000 + 20×300원</p>
          </div>
        </div>

        {/* 계산 예시 */}
        <div className="mt-12 bg-black text-white rounded-[24px] p-8">
          <h3 className="font-bold text-[16px]">요금 계산 예시 - 투명하게</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-6 text-[12px]">
            <div className="bg-white/10 rounded-[16px] p-4"><p className="opacity-60">STARTER</p><p className="mt-2 font-bold">월 8건 출고</p><p className="mt-2 opacity-70">→ 26,900원</p><p className="mt-1 text-[11px] opacity-50">10건 이내라 추가 없음</p></div>
            <div className="bg-white/10 rounded-[16px] p-4 border border-white/20"><p className="opacity-60">LITE</p><p className="mt-2 font-bold">월 120건 출고</p><p className="mt-2 opacity-70">→ 149,000 + (20×1,400) = 177,000원</p><p className="mt-1 text-[11px] opacity-50">100건 초과 20건 × 1,400원</p></div>
            <div className="bg-white/10 rounded-[16px] p-4"><p className="opacity-60">STANDARD</p><p className="mt-2 font-bold">월 600건 + 야간 50건</p><p className="mt-2 opacity-70">→ 599,000 + (100×1,200) + (50×300) = 734,000원</p><p className="mt-1 text-[11px] opacity-50">초과 100건 + 야간 추가</p></div>
          </div>
          <div className="mt-6 flex gap-3"><Link href="/onboarding" className="bg-white text-black px-6 py-3 rounded-full font-bold text-[12px]">무료로 시작하기 →</Link><Link href="/dashboard" className="border border-white/20 px-6 py-3 rounded-full font-bold text-[12px]">회원전용 입장</Link></div>
        </div>
      </main>
    </div>
  );
}

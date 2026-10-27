"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  { id: "STARTER", name: "STARTER", quota: "월 10건", price: "26,900", per: "2,690원", over: "1,600원", range: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개", size: "300×450×250 / 1 SKU", badge: "BETA", popular: false },
  { id: "LITE", name: "LITE", quota: "월 100건", price: "149,000", per: "1,490원", over: "1,400원", range: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", size: "1.1×1.1×1.8m", badge: "ORIGINAL", popular: true },
  { id: "STANDARD", name: "STANDARD", quota: "월 500건", price: "599,000", per: "1,198원", over: "1,200원", range: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개", size: "", badge: "", popular: false },
  { id: "GOLD", name: "GOLD", quota: "월 1,000건", price: "1,190,000", per: "1,190원", over: "1,150원", range: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개", size: "", badge: "", popular: false },
  { id: "PLATINUM", name: "PLATINUM", quota: "월 3,000건", price: "3,290,000", per: "1,096원", over: "1,100원", range: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개", size: "", badge: "", popular: false },
  { id: "VIP", name: "VIP", quota: "월 5,000건", price: "5,349,000", per: "1,069원", over: "1,050원", range: "5001건~", switchText: "대량 협의·규모 경제", storage: "파렛트 40개", size: "", badge: "", popular: false },
];

export default function HomePage() {
  const [selected, setSelected] = useState("STARTER");

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">김포센터</span></div>
          <div className="flex gap-2 items-center">
            <Link href="/login" className="text-[12px] px-4 py-2 rounded-full border border-black/10">로그인</Link>
            <Link href="/onboarding" className="text-[12px] px-4 py-2 rounded-full bg-black text-white">회원가입</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-[11px] opacity-60"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>BETA · 실제 발송 데이터 기반</div>
        <h1 className="mt-4 text-[40px] font-black leading-[0.9] tracking-[-0.03em]">필요한 만큼만,<br/>투명하게.</h1>
        <p className="mt-4 text-[14px] opacity-60 max-w-[480px]">합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함. 숨겨진 비용 없습니다.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {PLANS.slice(0,3).map(p=>(
            <div key={p.id} className={`rounded-[20px] p-6 border-2 bg-white relative ${selected===p.id ? "border-black" : "border-black/5"} ${p.popular ? "pt-8" : ""}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full">MOST POPULAR</div>}
              <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><span className="font-bold text-[12px] tracking-widest">{p.name}</span>{p.badge && <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{p.badge}</span>}</div><p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div><div className="text-right"><p className="text-[10px] opacity-40">건당</p><p className="font-bold text-[12px]">{p.per}</p><button onClick={()=>setSelected(p.id)} className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center ${selected===p.id ? "bg-black text-white border-black" : "border-black/10"}`}>{selected===p.id && "✓"}</button></div></div>
              <p className="mt-6 text-[28px] font-black">{p.price}<span className="text-[14px] font-normal opacity-50"> 원 / 월</span></p>
              <div className="mt-3"><span className="bg-black text-white text-[11px] px-3 py-1 rounded-full font-bold">{p.storage}</span><span className="text-[11px] opacity-50 ml-2">{p.size}</span></div>
              <div className="mt-5 space-y-2 text-[12px]"><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>합포장 3개 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>바코드 라벨링 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>일반 포장 무료</p></div>
              <button onClick={()=>setSelected(p.id)} className={`mt-6 w-full py-3 rounded-full font-bold text-[12px] ${selected===p.id ? "bg-black text-white" : "border border-black/10"}`}>{selected===p.id ? "선택됨 ✓" : `${p.name} 선택`}</button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {PLANS.slice(3).map(p=>(
            <div key={p.id} className={`rounded-[20px] p-6 border bg-white ${selected===p.id ? "border-black border-2" : "border-black/5"}`}>
              <div className="flex items-start justify-between"><div><span className="font-bold text-[12px] tracking-widest">{p.name}</span><p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div><div className="text-right"><p className="text-[10px] opacity-40">건당</p><p className="font-bold text-[12px]">{p.per}</p><button onClick={()=>setSelected(p.id)} className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center ${selected===p.id ? "bg-black text-white border-black" : "border-black/10"}`}>{selected===p.id && "✓"}</button></div></div>
              <p className="mt-6 text-[28px] font-black">{p.price}<span className="text-[14px] font-normal opacity-50"> 원 / 월</span></p>
              <div className="mt-3"><span className="bg-black/5 text-[11px] px-3 py-1 rounded-full font-bold">{p.storage}</span></div>
              <div className="mt-5 space-y-2 text-[12px] opacity-60"><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black/10 rounded-full flex items-center justify-center text-[10px]">✓</span>합포장 3개 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black/10 rounded-full flex items-center justify-center text-[10px]">✓</span>바코드 라벨링 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black/10 rounded-full flex items-center justify-center text-[10px]">✓</span>일반 포장 무료</p></div>
              <button onClick={()=>setSelected(p.id)} className={`mt-6 w-full py-3 rounded-full font-bold text-[12px] ${selected===p.id ? "bg-black text-white" : "border border-black/10"}`}>{selected===p.id ? "선택됨 ✓" : `${p.name} 선택`}</button>
            </div>
          ))}
        </div>

        {/* 새 요금제 테이블 - 이게 안 보였던 거! */}
        <div className="mt-16 border-t border-black/5 pt-12">
          <h2 className="text-[12px] opacity-40 tracking-widest">PRICING DETAILS</h2>
          <div className="mt-8 overflow-auto rounded-[16px] border border-black/5 bg-white">
            <table className="w-full text-[12px]">
              <thead className="bg-black text-white text-[11px]"><tr><th className="text-left py-3 px-4">요금제</th><th className="text-left">조합 건수</th><th className="text-left">월 요금</th><th className="text-left">건당 단가</th><th className="text-left"><span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px]">초과 건당 (CHEAP)</span></th><th className="text-left">자동 전환 안내</th><th className="text-left">보관 포함</th></tr></thead>
              <tbody>
                {PLANS.map(p=>(
                  <tr key={p.id} className={`border-b border-black/5 ${selected===p.id ? "bg-[#fafaf8]" : ""}`}><td className="py-3 px-4 font-bold">{p.name}</td><td>{p.quota}</td><td>{p.price}원</td><td>{p.per}</td><td><span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full text-[11px] font-bold">{p.over} ({p.range}) ↓</span></td><td className="text-[11px] opacity-60">{p.switchText}</td><td>{p.storage}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-2 text-[11px]">
            <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full">Toss Payments Metered Billing 지원 (사실)</span>
            <span className="bg-black/5 px-3 py-1 rounded-full opacity-60">규모 경제: STANDARD+ 원가 1,100원대 → 1,200원대 마진 8%</span>
          </div>
        </div>

        <div className="mt-16 border-t border-black/5 pt-12">
          <h2 className="text-[12px] opacity-40 tracking-widest">STORAGE & FEES</h2>
          <p className="mt-2 text-[22px] font-black">보관은 필요한 만큼,<br/>초과도 합리적으로.</p>
          <div className="mt-6 grid md:grid-cols-6 gap-3">
            {PLANS.map(p=>(
              <div key={p.id} className={`rounded-[16px] p-4 border bg-white ${selected===p.id ? "border-black border-2" : "border-black/5"}`}><p className="text-[10px] opacity-40">{p.name}</p><p className="font-bold text-[13px] mt-1">{p.storage}</p><p className="text-[11px] opacity-60 mt-1">{p.id==="STARTER" ? "초과 불가" : p.id==="LITE" ? "3만원 / 월" : p.id==="STANDARD" ? "3만원 / 월" : p.id==="GOLD" ? "2.5만원 / 월" : "2만원 / 월"}</p><p className="text-[10px] mt-2 bg-black/5 px-2 py-1 rounded-full inline-block">최소 {p.id==="STARTER" ? "1만원" : p.id==="LITE" ? "5만원" : p.id==="STANDARD" ? "15만원" : p.id==="GOLD" ? "25만원" : p.id==="PLATINUM" ? "50만원" : "80만원"}</p></div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-black/5 pt-12 pb-20">
          <h2 className="text-[11px] opacity-40 tracking-widest">NIGHT & WEEKEND</h2>
          <div className="flex items-center justify-between mt-2"><p className="text-[20px] font-black">야간·주말, 정해진 기준대로만.</p><div className="flex gap-2 text-[11px]"><span className="bg-black text-white px-3 py-1.5 rounded-full">평일 주간 09-18시 포함</span><span className="border border-black/10 px-3 py-1.5 rounded-full">연장·야간·휴일 +300~600원</span></div></div>
          <div className="mt-6 grid grid-cols-6 gap-0 border border-black/5 rounded-[16px] overflow-hidden bg-white text-[12px] text-center">
            <div className="py-4 border-r border-black/5"><p className="text-[11px] opacity-50">평일 주간</p><p className="text-[10px] opacity-40">09-18</p><p className="mt-2 font-bold text-green-600">포함</p></div>
            <div className="py-4 border-r border-black/5"><p className="text-[11px] opacity-50">평일 연장</p><p className="text-[10px] opacity-40">18-22</p><p className="mt-2 font-bold text-amber-600">+300원</p></div>
            <div className="py-4 border-r border-black/5"><p className="text-[11px] opacity-50">야간</p><p className="text-[10px] opacity-40">22-06</p><p className="mt-2 font-bold text-amber-600">+300원</p></div>
            <div className="py-4 border-r border-black/5"><p className="text-[11px] opacity-50">연장+야간</p><p className="text-[10px] opacity-40">22-24</p><p className="mt-2 font-bold text-red-600">+600원</p></div>
            <div className="py-4 border-r border-black/5"><p className="text-[11px] opacity-50">주말 주간</p><p className="text-[10px] opacity-40">09-18</p><p className="mt-2 font-bold text-amber-600">+300원</p></div>
            <div className="py-4"><p className="text-[11px] opacity-50">주말 야간</p><p className="text-[10px] opacity-40">22-06</p><p className="mt-2 font-bold text-red-600">+600원</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}

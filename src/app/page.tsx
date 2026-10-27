"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  { id: "STARTER", name: "STARTER", quota: "월 10건", price: "26,900", over: "1,600원", range: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개", size: "300×450×250 / 1 SKU", badge: "BETA" },
  { id: "LITE", name: "LITE", quota: "월 100건", price: "149,000", over: "1,400원", range: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", size: "1.1×1.1×1.8m", badge: "ORIGINAL", popular: true },
  { id: "STANDARD", name: "STANDARD", quota: "월 500건", price: "599,000", over: "1,200원", range: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개", size: "" },
  { id: "GOLD", name: "GOLD", quota: "월 1,000건", price: "1,190,000", over: "1,150원", range: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개", size: "" },
  { id: "PLATINUM", name: "PLATINUM", quota: "월 3,000건", price: "3,290,000", over: "1,100원", range: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개", size: "" },
  { id: "VIP", name: "VIP", quota: "월 5,000건", price: "5,349,000", over: "1,050원", range: "5001건~", switchText: "대량 협의·규모 경제", storage: "파렛트 40개", size: "" },
];

export default function HomePage() {
  const [selected, setSelected] = useState("STARTER");
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">김포센터</span></div>
          <div className="flex gap-2 items-center">
            <a href="#features" className="text-[12px] opacity-60 hover:opacity-100">서비스</a>
            <a href="#pricing" className="text-[12px] opacity-60 hover:opacity-100 ml-3">요금제</a>
            <a href="#how" className="text-[12px] opacity-60 hover:opacity-100 ml-3">이용방법</a>
            <Link href="/login" className="ml-4 text-[12px] px-4 py-2 rounded-full border border-black/10">로그인</Link>
            <Link href="/onboarding" className="text-[12px] px-4 py-2 rounded-full bg-black text-white">회원가입</Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex items-center gap-2 text-[11px] opacity-60"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>BETA · 김포 물류센터에서 직접 운영 · 실제 발송 데이터 기반</div>
          <h1 className="mt-6 text-[48px] font-black leading-[0.9] tracking-[-0.04em]">필요한 만큼만,<br/>투명하게.<br/><span className="opacity-20">FLEX CENTER.</span></h1>
          <p className="mt-6 text-[15px] opacity-60 max-w-[520px] leading-[1.6]">FLEX CENTER는 김포에 위치한 마이크로 풀필먼트 서비스입니다. 보관, 출고, 플랫폼 연동을 하나로. 합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함.</p>
          <div className="mt-8 flex gap-3"><Link href="/onboarding" className="bg-black text-white px-6 py-3 rounded-full font-bold text-[13px]">무료로 시작하기 →</Link><a href="#pricing" className="border border-black/10 px-6 py-3 rounded-full font-bold text-[13px]">요금제 보기</a></div>
        </section>

        {/* ABOUT */}
        <section className="bg-white border-y border-black/5">
          <div className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
            <div><p className="text-[11px] opacity-40 tracking-widest">ABOUT US</p><p className="mt-3 text-[20px] font-bold leading-tight">김포센터에서<br/>직접 운영하는<br/>풀필먼트</p></div>
            <div className="md:col-span-2"><p className="text-[14px] opacity-70 leading-[1.7]">FLEX CENTER는 경기도 김포시에 위치한 500평 규모의 물류센터를 직접 운영합니다. 네이버, 쿠팡, 11번가, G마켓 주문을 자동으로 수집하고, WMS로 피킹·패킹·송장까지 원스톱으로 처리합니다. 소규모 셀러를 위한 FLEX LITE부터 대형 셀러를 위한 작업자 WMS Pro까지, 필요한 만큼만 투명하게 사용하세요.</p><div className="mt-6 flex gap-6 text-[12px]"><div><p className="font-black text-[18px]">500평</p><p className="opacity-50">김포센터 규모</p></div><div><p className="font-black text-[18px]">6개</p><p className="opacity-50">연동 플랫폼</p></div><div><p className="font-black text-[18px]">99.8%</p><p className="opacity-50">정확도</p></div></div></div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-[1200px] mx-auto px-6 py-20">
          <p className="text-[11px] opacity-40 tracking-widest">FEATURES</p>
          <h2 className="mt-3 text-[28px] font-black">보관, 출고, 연동.<br/>한 번에.</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-black/5 rounded-[20px] p-6"><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">📦</div><h3 className="mt-4 font-bold text-[16px]">보관</h3><p className="mt-2 text-[13px] opacity-60 leading-[1.6]">선반 1개부터 파렛트 40개까지. 필요한 만큼만. SKU별 위치 관리, 유통기한 관리, 재고 부족 알림까지.</p></div>
            <div className="bg-white border border-black/5 rounded-[20px] p-6"><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">🚚</div><h3 className="mt-4 font-bold text-[16px]">출고</h3><p className="mt-2 text-[13px] opacity-60 leading-[1.6]">PDA 바코드 스캔으로 오피킹 0%. 피킹 카트 20개 배치, AI 동선 최적화, 저울로 무게 검증.</p></div>
            <div className="bg-white border border-black/5 rounded-[20px] p-6"><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">🔗</div><h3 className="mt-4 font-bold text-[16px]">연동</h3><p className="mt-2 text-[13px] opacity-60 leading-[1.6]">네이버, 쿠팡, 11번가, G마켓, 옥션, 지마켓. 주문 자동 수집, 송장 자동 업로드.</p></div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="bg-white border-y border-black/5 py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-start justify-between"><div><p className="text-[11px] opacity-40 tracking-widest">PRICING</p><h2 className="mt-3 text-[28px] font-black">필요한 만큼만,<br/>투명하게.</h2><p className="mt-3 text-[13px] opacity-60">합포장 3개, 바코드 라벨링, 박스+완충재+인쇄까지 모두 포함.</p></div><button onClick={()=>setShowDetail(!showDetail)} className="text-[12px] px-4 py-2 rounded-full border border-black/10 font-bold">{showDetail ? "간략히 보기" : "상세 요금제 보기 →"}</button></div>

            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {PLANS.slice(0,3).map(p=>(
                <div key={p.id} className={`rounded-[20px] p-6 border-2 bg-[#fafaf8] relative ${selected===p.id ? "border-black" : "border-black/5"} ${p.popular ? "pt-8" : ""}`}>
                  {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full">MOST POPULAR</div>}
                  <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><span className="font-bold text-[12px] tracking-widest">{p.name}</span>{p.badge && <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{p.badge}</span>}</div><p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div><button onClick={()=>setSelected(p.id)} className={`w-6 h-6 rounded-full border flex items-center justify-center ${selected===p.id ? "bg-black text-white border-black" : "border-black/10"}`}>{selected===p.id && "✓"}</button></div>
                  <p className="mt-6 text-[28px] font-black">{p.price}<span className="text-[14px] font-normal opacity-50"> 원 / 월</span></p>
                  <div className="mt-3"><span className="bg-black text-white text-[11px] px-3 py-1 rounded-full font-bold">{p.storage}</span><span className="text-[11px] opacity-50 ml-2">{p.size}</span></div>
                  <div className="mt-5 space-y-2 text-[12px]"><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>합포장 3개 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>바코드 라벨링 무료</p><p className="flex items-center gap-2"><span className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[10px]">✓</span>일반 포장 무료</p></div>
                  <button onClick={()=>setSelected(p.id)} className={`mt-6 w-full py-3 rounded-full font-bold text-[12px] ${selected===p.id ? "bg-black text-white" : "border border-black/10"}`}>{selected===p.id ? "선택됨 ✓" : `${p.name} 선택`}</button>
                </div>
              ))}
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {PLANS.slice(3).map(p=>(
                <div key={p.id} className={`rounded-[20px] p-6 border bg-[#fafaf8] ${selected===p.id ? "border-black border-2" : "border-black/5"}`}>
                  <div className="flex items-start justify-between"><div><span className="font-bold text-[12px] tracking-widest">{p.name}</span><p className="text-[11px] opacity-50 mt-1">{p.quota}</p></div><button onClick={()=>setSelected(p.id)} className={`w-6 h-6 rounded-full border flex items-center justify-center ${selected===p.id ? "bg-black text-white border-black" : "border-black/10"}`}>{selected===p.id && "✓"}</button></div>
                  <p className="mt-6 text-[28px] font-black">{p.price}<span className="text-[14px] font-normal opacity-50"> 원 / 월</span></p>
                  <div className="mt-3"><span className="bg-black/5 text-[11px] px-3 py-1 rounded-full font-bold">{p.storage}</span></div>
                  <div className="mt-5 space-y-2 text-[12px] opacity-60"><p>✓ 합포장 3개 무료</p><p>✓ 바코드 라벨링 무료</p><p>✓ 일반 포장 무료</p></div>
                  <button onClick={()=>setSelected(p.id)} className={`mt-6 w-full py-3 rounded-full font-bold text-[12px] ${selected===p.id ? "bg-black text-white" : "border border-black/10"}`}>{selected===p.id ? "선택됨 ✓" : `${p.name} 선택`}</button>
                </div>
              ))}
            </div>

            {showDetail && (
              <div className="mt-12">
                <h3 className="font-bold text-[14px]">상세 요금제 - 초과 건당 포함</h3>
                <div className="mt-6 overflow-auto rounded-[16px] border border-black/5 bg-white">
                  <table className="w-full text-[12px]">
                    <thead className="bg-black text-white text-[11px]"><tr><th className="text-left py-3 px-4">요금제</th><th className="text-left">조합 건수</th><th className="text-left">월 요금</th><th className="text-left"><span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px]">초과 건당</span></th><th className="text-left">자동 전환 안내</th><th className="text-left">보관 포함</th></tr></thead>
                    <tbody>
                      {PLANS.map(p=>(
                        <tr key={p.id} className={`border-b border-black/5 ${selected===p.id ? "bg-[#fafaf8] font-bold" : ""}`}><td className="py-3 px-4">{p.name}</td><td>{p.quota}</td><td>{p.price}원</td><td><span className={`px-2 py-1 rounded-full text-[11px] font-bold ${selected===p.id ? "bg-black text-white" : "bg-green-50 text-green-700 border border-green-200"}`}>{p.over} ({p.range}) ↓</span></td><td className="text-[11px] opacity-60">{p.switchText}</td><td>{p.storage}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex gap-2 text-[11px]"><span className="bg-black/5 px-3 py-1 rounded-full">Toss Payments Metered Billing 지원</span><span className="bg-black/5 px-3 py-1 rounded-full opacity-60">보관료: 파렛트당 2~3만원/월, 최소 1만~80만원</span><span className="bg-black/5 px-3 py-1 rounded-full opacity-60">야간/주말 +300~600원</span></div>
              </div>
            )}
          </div>
        </section>

        <section id="how" className="max-w-[1200px] mx-auto px-6 py-20">
          <p className="text-[11px] opacity-40 tracking-widest">HOW IT WORKS</p>
          <h2 className="mt-3 text-[28px] font-black">4단계면 끝.<br/>오늘부터 시작.</h2>
          <div className="mt-10 grid md:grid-cols-4 gap-4">
            <div className="bg-white border border-black/5 rounded-[20px] p-6"><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-[12px]">1</div><h3 className="mt-4 font-bold text-[14px]">회원가입 & 요금제 선택</h3><p className="mt-2 text-[12px] opacity-60">사업자 정보 입력, 요금제 선택. 검증 후 관리자 승인.</p></div>
            <div className="bg-white border border-black/5 rounded-[20px] p-6"><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-[12px]">2</div><h3 className="mt-4 font-bold text-[14px]">상품 등록 & 입고</h3><p className="mt-2 text-[12px] opacity-60">상품 마스터에 SKU, 바코드 등록. 입고 요청서 작성, 박스 발송.</p></div>
            <div className="bg-white border border-black/5 rounded-[20px] p-6"><div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-[12px]">3</div><h3 className="mt-4 font-bold text-[14px]">플랫폼 연동 & 주문 수집</h3><p className="mt-2 text-[12px] opacity-60">네이버, 쿠팡, 11번가, G마켓 연동. 주문 자동 수집.</p></div>
            <div className="bg-black text-white rounded-[20px] p-6"><div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-[12px]">4</div><h3 className="mt-4 font-bold text-[14px]">WMS 출고 & 송장 업로드</h3><p className="mt-2 text-[12px] opacity-60">PDA 스캔 피킹, 패킹, 송장 출력, 플랫폼에 자동 업로드. 끝!</p></div>
          </div>
        </section>

        <footer className="border-t border-black/5 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-12 flex justify-between text-[11px] opacity-40"><div><p className="font-bold opacity-100">FLEX CENTER</p><p className="mt-1">경기도 김포시 · 500평 물류센터 · BETA</p></div><div className="text-right"><p>문의: phankyu@gmail.com</p><p className="mt-1">© 2024 FLEX CENTER. All rights reserved.</p></div></div>
        </footer>
      </main>
    </div>
  );
}

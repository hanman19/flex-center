"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function PlatformsProAllKoreaPage() {
  const [mounted, setMounted] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([
    { id: "1", name: "스마트스토어", eng: "Naver SmartStore", type: "naver", status: "연동됨", last_sync: "10분 전", orders_today: 45, category: "종합", fee: "2%", auto: true },
    { id: "2", name: "쿠팡", eng: "Coupang", type: "coupang", status: "연동됨", last_sync: "5분 전", orders_today: 78, category: "종합", fee: "8~10%", auto: true },
    { id: "3", name: "G마켓", eng: "Gmarket", type: "gmarket", status: "연동됨", last_sync: "15분 전", orders_today: 23, category: "종합", fee: "8~13%", auto: true },
    { id: "4", name: "옥션", eng: "Auction", type: "auction", status: "연동됨", last_sync: "15분 전", orders_today: 12, category: "종합", fee: "8~13%", auto: true },
    { id: "5", name: "11번가", eng: "11st", type: "11st", status: "연동 대기", last_sync: "-", orders_today: 0, category: "종합", fee: "8~13%", auto: false },
    { id: "6", name: "SSG닷컴", eng: "SSG", type: "ssg", status: "미연동", last_sync: "-", orders_today: 0, category: "종합", fee: "8~12%", auto: false },
    { id: "7", name: "롯데ON", eng: "Lotte ON", type: "lotteon", status: "미연동", last_sync: "-", orders_today: 0, category: "종합", fee: "8~12%", auto: false },
    { id: "8", name: "카카오 쇼핑", eng: "Kakao Shopping", type: "kakao", status: "연동 대기", last_sync: "-", orders_today: 0, category: "종합", fee: "5%", auto: false },
    { id: "9", name: "지그재그", eng: "Zigzag", type: "zigzag", status: "미연동", last_sync: "-", orders_today: 0, category: "패션", fee: "15%", auto: false },
    { id: "10", name: "에이블리", eng: "Ably", type: "ably", status: "미연동", last_sync: "-", orders_today: 0, category: "패션", fee: "15%", auto: false },
    { id: "11", name: "무신사", eng: "Musinsa", type: "musinsa", status: "미연동", last_sync: "-", orders_today: 0, category: "패션", fee: "15~20%", auto: false },
    { id: "12", name: "브랜디", eng: "Brandy", type: "brandy", status: "미연동", last_sync: "-", orders_today: 0, category: "패션", fee: "15%", auto: false },
    { id: "13", name: "위메프", eng: "Wemakeprice", type: "wemakeprice", status: "미연동", last_sync: "-", orders_today: 0, category: "종합", fee: "8%", auto: false },
    { id: "14", name: "티몬", eng: "Tmon", type: "tmon", status: "미연동", last_sync: "-", orders_today: 0, category: "종합", fee: "8%", auto: false },
    { id: "15", name: "오늘의집", eng: "Bucketplace", type: "ohouse", status: "미연동", last_sync: "-", orders_today: 0, category: "인테리어", fee: "10%", auto: false },
  ]);

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  const connected = platforms.filter(p=>p.status==="연동됨").length;
  const totalOrders = platforms.reduce((s,p)=>s+p.orders_today,0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">플랫폼 연동 Pro - 대한민국 대표 플랫폼 전체</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">15개 플랫폼 + 송장 품명 매핑</span><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">{connected}개 연동됨 / 오늘 {totalOrders}건</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">대한민국 대표 플랫폼 전체 연동! 종합, 패션, 인테리어! 주문 자동 수집 + 송장 품명 매핑 + 송장 자동 업로드!</p>

        <div className="mt-6 grid md:grid-cols-4 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-4"><p className="text-[11px] opacity-40">종합몰</p><p className="text-[18px] font-black mt-1">8개</p><p className="text-[10px] opacity-40 mt-1">스마트스토어, 쿠팡, G마켓, 옥션, 11번가, SSG, 롯데ON, 카카오</p></div>
          <div className="bg-black text-white rounded-[16px] p-4"><p className="text-[11px] opacity-50">패션</p><p className="text-[18px] font-black mt-1">4개</p><p className="text-[10px] opacity-50 mt-1">지그재그, 에이블리, 무신사, 브랜디</p></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-4"><p className="text-[11px] opacity-60 text-black">오늘 주문</p><p className="text-[18px] font-black mt-1 text-black">{totalOrders}건</p><p className="text-[10px] opacity-60 mt-1 text-black">15개 플랫폼 합계 - 송장 품명 기준!</p></div>
          <div className="bg-white border border-green-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">연동됨</p><p className="text-[18px] font-black mt-1 text-green-700">{connected}개 / 15개</p><p className="text-[10px] opacity-50 mt-1">자동 수집 ON</p></div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-[14px]">종합몰 - 8개 (제일 중요!)</h3>
          <div className="mt-3 grid md:grid-cols-4 gap-3">
            {platforms.filter(p=>p.category==="종합").map(p=><div key={p.id} className={`bg-white border rounded-[16px] p-4 ${p.status==="연동됨" ? "border-green-200" : "border-black/10"}`}>
              <div className="flex items-center justify-between"><p className="font-black text-[13px]">{p.name}</p><span className={`px-2 py-1 rounded-full text-[9px] font-bold ${p.status==="연동됨" ? "bg-green-100 text-green-700" : p.status==="연동 대기" ? "bg-amber-100 text-amber-700" : "bg-gray-100"}`}>{p.status}</span></div>
              <p className="text-[10px] opacity-50 mt-1">{p.eng} / 수수료 {p.fee}</p>
              <p className="text-[11px] opacity-60 mt-2">오늘 {p.orders_today}건 / {p.last_sync}</p>
              <div className="mt-3 flex gap-1"><button className="flex-1 bg-black text-white py-1.5 rounded-full text-[10px] font-bold">연동</button><button className="flex-1 bg-white border py-1.5 rounded-full text-[10px] font-bold">설정</button></div>
            </div>)}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-[14px]">패션 - 4개 (지그재그, 에이블리, 무신사, 브랜디 - 패션 브랜드 필수!)</h3>
          <div className="mt-3 grid md:grid-cols-4 gap-3">
            {platforms.filter(p=>p.category==="패션").map(p=><div key={p.id} className={`bg-white border rounded-[16px] p-4 ${p.status==="연동됨" ? "border-green-200" : "border-black/10"}`}>
              <div className="flex items-center justify-between"><p className="font-black text-[13px]">{p.name}</p><span className={`px-2 py-1 rounded-full text-[9px] font-bold ${p.status==="연동됨" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{p.status}</span></div>
              <p className="text-[10px] opacity-50 mt-1">{p.eng} / 수수료 {p.fee} / 패션</p>
              <p className="text-[11px] opacity-60 mt-2">오늘 {p.orders_today}건</p>
              <div className="mt-3 flex gap-1"><button className="flex-1 bg-black text-white py-1.5 rounded-full text-[10px] font-bold">연동</button><button className="flex-1 bg-white border py-1.5 rounded-full text-[10px] font-bold">설정</button></div>
            </div>)}
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">종합몰 API 연동</p><p className="text-[11px] opacity-60 mt-2">스마트스토어, 쿠팡, G마켓, 옥션, 11번가, SSG, 롯데ON, 카카오 - 전부 API 있음! 주문 자동 수집! 송장 자동 업로드! seller_platforms 테이블에 API 키 저장!</p></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5"><p className="font-bold text-[13px] text-black">패션 플랫폼 연동</p><p className="text-[11px] text-black/60 mt-2">지그재그, 에이블리, 무신사, 브랜디 - 패션 브랜드는 필수! 수수료 15%! API로 주문 수집! 송장 품명 매핑으로 작업자는 송장 품명으로 피킹!</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">송장 품명 매핑 - 15개 플랫폼 전체!</p><p className="text-[11px] opacity-60 mt-2">15개 플랫폼 옵션 다 다름! `블랙, 100ml` / `BLACK / 100ML` / `블랙_100ml` → 모두 `무선이어폰 / 블랙`으로 매핑! product_bundles, seller_platforms 테이블에 매핑 규칙!</p></div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">연동 우선순위 - 김포센터 셀러들 기준으로!</h3>
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-green-50 border border-green-200 rounded-[12px] p-3"><p className="font-black">1순위 - 필수! (지금 연동!)</p><p className="mt-2">스마트스토어, 쿠팡, G마켓, 옥션 - 90% 셀러가 쓰는 플랫폼! 오늘 주문 158건 중 90%!</p></div>
            <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-3"><p className="font-black">2순위 - 권장!</p><p className="mt-2">11번가, 카카오, 지그재그, 에이블리 - 50% 셀러가 쓰는 플랫폼! 패션 브랜드는 지그재그, 에이블리 필수!</p></div>
            <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-3"><p className="font-black">3순위 - 선택!</p><p className="mt-2">SSG, 롯데ON, 무신사, 브랜디, 위메프, 티몬, 오늘의집 - 대형 브랜드, 특정 카테고리!</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}

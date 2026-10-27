"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

const PLATFORMS = [
  { id: "naver", name: "네이버 스마트스토어", color: "bg-green-500", status: "연동중", api: "주문 수집: /v1/pay-orders" },
  { id: "coupang", name: "쿠팡", color: "bg-red-500", status: "연동중", api: "주문 수집: /v2/providers/openapi/orders" },
  { id: "eleven", name: "11번가", color: "bg-orange-500", status: "미연동", api: "준비중" },
  { id: "gmarket", name: "G마켓", color: "bg-blue-500", status: "미연동", api: "준비중" },
  { id: "auction", name: "옥션", color: "bg-purple-500", status: "미연동", api: "준비중" },
  { id: "cafe24", name: "카페24", color: "bg-black", status: "연동중", api: "주문 수집: /api/v2/admin/orders" },
];

export default function PlatformsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <h1 className="text-[28px] font-black">플랫폼 연동</h1>
        <p className="text-[13px] opacity-60 mt-1">네이버, 쿠팡, 카페24 주문 자동 수집 - 사방넷처럼!</p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {PLATFORMS.map(p=>(
            <div key={p.id} className="bg-white border border-black/5 rounded-[20px] p-6 hover:shadow-lg transition">
              <div className="flex items-center gap-3"><div className={`w-8 h-8 ${p.color} rounded-full`}></div><span className="font-bold text-[14px]">{p.name}</span></div>
              <p className={`mt-4 text-[11px] px-3 py-1 rounded-full inline-block font-bold ${p.status==="연동중" ? "bg-green-100 text-green-700" : "bg-black/5"}`}>{p.status}</p>
              <p className="text-[10px] opacity-40 mt-2">{p.api}</p>
              <button className="mt-4 w-full border border-black/10 py-2.5 rounded-full text-[12px] font-bold">{p.status==="연동중" ? "연동 해제" : "연동하기 (API 키 입력)"}</button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-black text-white rounded-[16px] p-6"><h3 className="font-bold text-[14px]">Phase 2: 실제 연동</h3><p className="text-[11px] opacity-60 mt-2">네이버 커머스 API, 쿠팡 WING API, 카페24 API 키를 입력하면 5분마다 주문을 자동 수집해서 orders 테이블에 넣고, 출고 후 송장번호를 다시 플랫폼에 업로드! 사방넷처럼!</p></div>
      </main>
    </div>
  );
}

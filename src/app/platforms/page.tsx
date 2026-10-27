"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import TopNav from "@/components/TopNav";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const PLATFORMS = [
  { id: "naver", name: "네이버 스마트스토어", color: "bg-green-500", status: "연동중" },
  { id: "coupang", name: "쿠팡", color: "bg-red-500", status: "연동중" },
  { id: "eleven", name: "11번가", color: "bg-orange-500", status: "미연동" },
  { id: "gmarket", name: "G마켓", color: "bg-blue-500", status: "미연동" },
  { id: "auction", name: "옥션", color: "bg-purple-500", status: "미연동" },
  { id: "cafe24", name: "카페24", color: "bg-black", status: "연동중" },
];

export default function PlatformsPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold tracking-tight">플랫폼 연동</h1>
        <p className="text-[13px] opacity-60 mt-1">네이버, 쿠팡, 11번가 주문 자동 수집</p>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {PLATFORMS.map(p=>(
            <div key={p.id} className="bg-white border border-black/5 rounded-[20px] p-6">
              <div className="flex items-center gap-3"><div className={`w-8 h-8 ${p.color} rounded-full`}></div><span className="font-bold text-[14px]">{p.name}</span></div>
              <p className={`mt-4 text-[11px] px-3 py-1 rounded-full inline-block font-bold ${p.status==="연동중" ? "bg-green-100 text-green-700" : "bg-black/5"}`}>{p.status}</p>
              <button className="mt-4 w-full border border-black/10 py-2.5 rounded-full text-[12px] font-bold">{p.status==="연동중" ? "연동 해제" : "연동하기"}</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

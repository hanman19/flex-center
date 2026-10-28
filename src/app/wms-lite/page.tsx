"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WMSLitePage() {
  const [mounted, setMounted] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(()=>{ setMounted(true); fetchInventory(); }, []);

  const fetchInventory = async () => {
    const { data } = await supabase.from("inventory").select("*").limit(20);
    if (data) setInventory(data);
  };

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">WMS Lite - 셀러용 간단 WMS!</h1>
        <p className="text-[13px] opacity-60 mt-1">셀러가 보는 간단한 재고, 주문! test@naver.com 같은 셀러 계정용!</p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-5">
            <p className="font-bold">내 재고</p>
            <p className="text-[24px] font-black mt-2">{inventory.length}개</p>
            <p className="text-[11px] opacity-60 mt-1">내 상품 재고 현황!</p>
          </div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5">
            <p className="font-bold text-black">내 주문</p>
            <p className="text-[24px] font-black mt-2 text-black">127건</p>
            <p className="text-[11px] text-black/60 mt-1">오늘 주문! 송장 품명으로!</p>
          </div>
          <div className="bg-black text-white rounded-[16px] p-5">
            <p className="font-bold">입고 요청</p>
            <p className="text-[11px] opacity-60 mt-1">입고 요청하기!</p>
            <button className="mt-3 bg-white text-black px-4 py-2 rounded-full text-[11px] font-bold">입고 요청!</button>
          </div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <p className="font-bold">내 재고 목록 - Supabase inventory 테이블!</p>
          <div className="mt-4 space-y-2">
            {inventory.length===0 ? <p className="text-[11px] opacity-60">재고 없음! Supabase inventory 테이블에서 가져옴!</p> : inventory.map((item,i)=><div key={i} className="border-b py-2 flex justify-between text-[11px]"><span>{item.product_name || item.invoice_name || "상품"}</span><span>{item.quantity || item.stock}개</span></div>)}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

export default function WmsLitePage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [inbounds, setInbounds] = useState<any[]>([]);
  const [tab, setTab] = useState<"stock" | "inbound" | "outbound">("stock");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: inv } = await supabase.from("seller_inventory").select("*").eq("seller_id", user.id);
      if (inv && inv.length > 0) setInventory(inv);
      else setInventory([
        { id: "1", sku: "EAR-001", product_name: "무선 이어폰", qty: 150, location: "A-01-02", box_count: 3, inbound_date: "2024-10-20", status: "보관중" },
        { id: "2", sku: "WATCH-02", product_name: "스마트 워치", qty: 45, location: "B-02-05", box_count: 1, inbound_date: "2024-10-22", status: "보관중" },
      ]);
      setLoading(false);
    }; load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <h1 className="text-[28px] font-black">내 창고 WMS (FLEX LITE)</h1>
        <p className="text-[13px] opacity-60 mt-1">셀러 전용 - 내 재고만 보는 가벼운 WMS. 복잡한 기능 없음.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">내 총 재고</p><p className="text-[22px] font-bold mt-1">{inventory.reduce((s,i)=>s+(i.qty||0),0)}개</p><p className="text-[11px] opacity-50 mt-1">{inventory.length} SKU</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">입고 대기</p><p className="text-[22px] font-bold mt-1">0박스</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">내 위치</p><p className="text-[14px] font-bold mt-1">{inventory.map(i=>i.location).join(", ")}</p></div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={()=>setTab("stock")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="stock" ? "bg-black text-white" : "bg-white border-black/10"}`}>내 재고 ({inventory.length})</button>
          <button onClick={()=>setTab("inbound")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="inbound" ? "bg-black text-white" : "bg-white border-black/10"}`}>입고 요청</button>
          <button onClick={()=>setTab("outbound")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="outbound" ? "bg-black text-white" : "bg-white border-black/10"}`}>출고 내역</button>
        </div>

        {tab==="stock" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">상품 / SKU</th><th className="text-center">위치</th><th className="text-center">박스</th><th className="text-center">수량</th><th className="text-center">상태</th></tr></thead>
              <tbody>{inventory.map(i=><tr key={i.id} className="border-b border-black/[0.03]"><td className="py-4 px-6"><p className="font-bold">{i.product_name}</p><p className="font-mono text-[10px] opacity-50">{i.sku}</p></td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">{i.location}</span></td><td className="text-center">{i.box_count}박스</td><td className="text-center font-bold">{i.qty}개</td><td className="text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px]">보관중</span></td></tr>)}</tbody>
            </table>
          </div>
        )}
        {tab!=="stock" && <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-12 text-center text-[13px] opacity-50">준비중 - Phase 2에서 입고 요청서, 출고 내역 연동</div>}
      </main>
    </div>
  );
}

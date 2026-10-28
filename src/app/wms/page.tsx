"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function WMSLiteProPageFixed() {
  const [stock, setStock] = useState<any[]>([
    { sku: "EAR-001", product_name: "무선 이어폰 Pro", invoice_name: "무선이어폰 / 블랙", qty: 50, location: "A-01-02", expiry: "2025-10-20", lot: "LOT-2024-001", inbound: "2024-10-20", safety: 20 },
    { sku: "WATCH-02", product_name: "스마트 워치", invoice_name: "스마트워치 S8 45mm", qty: 30, location: "B-02-05", qty2: 30, expiry: "2026-10-22", lot: "LOT-2024-002", inbound: "2024-10-22", safety: 10 },
  ]);
  const [tab, setTab] = useState<"stock" | "asn" | "expiry" | "safety" | "inbound" | "outbound">("stock");
  const [showASN, setShowASN] = useState(false);
  // FIX: new Date() 제거! 빈 문자열로 시작!
  const [asnForm, setAsnForm] = useState({ sku: "", product_name: "", invoice_name: "", box: 1, qty: 0, tracking: "", expiry: "", lot: "", date: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: useEffect 안에서 날짜 설정! prerender 에러 해결!
    setAsnForm(prev => ({ ...prev, date: new Date().toISOString().split("T")[0] }));
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">WMS Lite Pro - 셀러용</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">내 재고 + 입고 + 송장 품명</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">내 상품 재고, 입고 요청, 유통기한, 안전재고! 송장 품명으로 관리!</p>

        <div className="mt-6 flex gap-2">
          <button onClick={()=>setTab("stock")} className={`px-4 py-2 rounded-full text-[12px] font-bold border ${tab==="stock" ? "bg-black text-white" : "bg-white"}`}>재고</button>
          <button onClick={()=>setTab("asn")} className={`px-4 py-2 rounded-full text-[12px] font-bold border ${tab==="asn" ? "bg-black text-white" : "bg-white"}`}>입고(ASN)</button>
          <button onClick={()=>setTab("expiry")} className={`px-4 py-2 rounded-full text-[12px] font-bold border ${tab==="expiry" ? "bg-black text-white" : "bg-white"}`}>유통기한</button>
          <button onClick={()=>setTab("safety")} className={`px-4 py-2 rounded-full text-[12px] font-bold border ${tab==="safety" ? "bg-black text-white" : "bg-white"}`}>안전재고</button>
          <button onClick={()=>setShowASN(true)} className="ml-auto bg-black text-white px-5 py-2 rounded-full text-[12px] font-bold">+ 입고 요청</button>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">SKU / 송장 품명 / 내부 품명</th><th className="text-center">수량 / 안전</th><th className="text-center">위치 / 로트 / 유통기한</th><th className="text-center">상태</th></tr></thead>
            <tbody>{stock.map((s,i)=><tr key={i} className="border-b"><td className="py-4 px-6"><p className="font-black">📦 {s.invoice_name} ({s.sku})</p><p className="text-[11px] opacity-50">내부: {s.product_name}</p></td><td className="text-center"><p className="font-bold">{s.qty}개</p><p className="text-[10px] opacity-50">안전 {s.safety}개</p></td><td className="text-center"><span className="bg-black text-white px-2 py-1 rounded-full text-[10px]">{s.location}</span><p className="text-[10px] opacity-40 mt-1">{s.lot} · {s.expiry}</p></td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.qty < s.safety ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{s.qty < s.safety ? "재고 부족" : "정상"}</span></td></tr>)}</tbody>
          </table>
        </div>

        {showASN && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-[16px] p-6 max-w-[500px] w-full mx-4">
            <h3 className="font-black text-[16px]">입고 요청 (ASN)</h3>
            <div className="mt-4 space-y-3">
              <input value={asnForm.sku} onChange={e=>setAsnForm({...asnForm, sku:e.target.value})} placeholder="SKU" className="w-full border rounded-full px-4 py-2 text-[12px]" />
              <input value={asnForm.product_name} onChange={e=>setAsnForm({...asnForm, product_name:e.target.value})} placeholder="내부 품명" className="w-full border rounded-full px-4 py-2 text-[12px]" />
              <input value={asnForm.invoice_name} onChange={e=>setAsnForm({...asnForm, invoice_name:e.target.value})} placeholder="송장 품명 (예: 무선이어폰 / 블랙)" className="w-full border rounded-full px-4 py-2 text-[12px]" />
              <input value={asnForm.qty} onChange={e=>setAsnForm({...asnForm, qty: Number(e.target.value)})} placeholder="수량" type="number" className="w-full border rounded-full px-4 py-2 text-[12px]" />
              <input value={asnForm.date} onChange={e=>setAsnForm({...asnForm, date:e.target.value})} type="date" className="w-full border rounded-full px-4 py-2 text-[12px]" />
            </div>
            <div className="mt-4 flex gap-2"><button onClick={()=>setShowASN(false)} className="flex-1 bg-black text-white py-2.5 rounded-full text-[12px] font-bold">입고 요청</button><button onClick={()=>setShowASN(false)} className="flex-1 bg-gray-100 py-2.5 rounded-full text-[12px] font-bold">닫기</button></div>
          </div></div>
        )}
      </main>
    </div>
  );
}

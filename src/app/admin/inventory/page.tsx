"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function AdminInventoryPage() {
  const [mounted, setMounted] = useState(false);
  const [stock, setStock] = useState<any[]>([
    { sku: "EAR-001", invoice_name: "무선이어폰 / 블랙", qty: 150, location: "A-01-02", seller: "브랜드A" },
    { sku: "COS-001", invoice_name: "수분에센스 100ml", qty: 80, location: "A-02-01", seller: "브랜드C" },
  ]);
  useEffect(()=>{ setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">재고 관리 - 전체 셀러</h1>
        <p className="text-[13px] opacity-60 mt-1">모든 셀러 재고! 송장 품명 기준!</p>
        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / SKU / 셀러</th><th className="text-center">수량</th><th className="text-center">위치</th><th className="text-center">상태</th></tr></thead>
            <tbody>{stock.map((s,i)=><tr key={i} className="border-b"><td className="py-4 px-6"><p className="font-bold">📦 {s.invoice_name} ({s.sku})</p><p className="text-[11px] opacity-50">{s.seller}</p></td><td className="text-center">{s.qty}개</td><td className="text-center"><span className="bg-black text-white px-2 py-1 rounded-full text-[10px]">{s.location}</span></td><td className="text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">정상</span></td></tr>)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function AdminInboundPage() {
  const [mounted, setMounted] = useState(false);
  const [inbounds, setInbounds] = useState<any[]>([
    { id: "1", sku: "EAR-001", invoice_name: "무선이어폰 / 블랙", qty: 100, status: "대기", seller: "브랜드A", date: "2024-10-27", tracking: "CJ 630012345678" },
    { id: "2", sku: "COS-001", invoice_name: "수분에센스 100ml", qty: 50, status: "입고중", seller: "브랜드C", date: "2024-10-27", tracking: "CJ 630098765432" },
  ]);

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">입고 관리 - ASN</h1>
        <p className="text-[13px] opacity-60 mt-1">셀러 입고 요청 확인! 송장 품명으로 입고!</p>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / SKU / 셀러</th><th className="text-center">수량</th><th className="text-center">상태</th><th className="text-center">입고일 / 운송장</th><th className="text-center">액션</th></tr></thead>
            <tbody>{inbounds.map(i=><tr key={i.id} className="border-b"><td className="py-4 px-6"><p className="font-bold">📦 {i.invoice_name} ({i.sku})</p><p className="text-[11px] opacity-50">{i.seller}</p></td><td className="text-center">{i.qty}개</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${i.status==="입고중" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>{i.status}</span></td><td className="text-center"><p className="text-[11px]">{i.date}</p><p className="text-[10px] opacity-50">{i.tracking}</p></td><td className="text-center"><button className="bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-bold">입고 완료</button></td></tr>)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

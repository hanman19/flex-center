"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function InternationalOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([
    { tracking: "FLEXJP001", invoice_name: "무선이어폰 / 블랙", country: "JP", hs: "8517.12-1000", weight: "500g", chargeable: "1.2kg", mawb: "180-12345678", status: "입고 완료", customer: "야마다 타로" },
    { tracking: "FLEXUS002", invoice_name: "수분에센스 / 100ml", country: "US", hs: "3304.99-1000", weight: "300g", chargeable: "0.8kg", mawb: "180-12345678", status: "라벨 부착", customer: "John Smith" },
  ]);

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">국제특송 주문 관리 OMS - TRACKING으로 관리, 수정!</h1>
        <p className="text-[13px] opacity-60 mt-1">TRACKING NUMBER로 주문 관리! 엑셀 업로드! API 수집! 송장 품명 기준!</p>

        <div className="mt-4 flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold">엑셀 업로드 - 주문 업로드!</button>
          <button className="bg-[#FFC61A] text-black border border-black px-4 py-2 rounded-full text-[12px] font-bold">QOO10에서 주문 수집!</button>
          <button className="bg-white border border-black/10 px-4 py-2 rounded-full text-[12px]">Amazon Japan 수집!</button>
          <input placeholder="TRACKING NUMBER로 검색 - FLEXJP001" className="border rounded-full px-4 py-2 text-[12px] w-[300px]" />
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-bold">주문 목록 - TRACKING NUMBER로 관리! 수정 가능!</p>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px]">총 {orders.length}건</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-[#fafaf8] border-b">
                <tr>
                  <th className="p-3 text-left">TRACKING NUMBER</th>
                  <th className="p-3 text-left">송장 품명</th>
                  <th className="p-3 text-left">국가</th>
                  <th className="p-3 text-left">HS CODE</th>
                  <th className="p-3 text-left">GROSS / CHARGEABLE</th>
                  <th className="p-3 text-left">MAWB</th>
                  <th className="p-3 text-left">고객</th>
                  <th className="p-3 text-left">상태</th>
                  <th className="p-3 text-left">수정</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o,i)=><tr key={i} className="border-b hover:bg-[#fafaf8]">
                  <td className="p-3 font-mono font-bold">{o.tracking}</td>
                  <td className="p-3">{o.invoice_name}</td>
                  <td className="p-3">{o.country}</td>
                  <td className="p-3 font-mono">{o.hs}</td>
                  <td className="p-3">{o.weight} / {o.chargeable}</td>
                  <td className="p-3 font-mono">{o.mawb}</td>
                  <td className="p-3">{o.customer}</td>
                  <td className="p-3"><span className="bg-black text-white px-2 py-1 rounded-full text-[9px]">{o.status}</span></td>
                  <td className="p-3"><button className="bg-[#FFC61A] text-black border border-black px-2 py-1 rounded-full text-[9px] font-bold">수정</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 bg-white border border-black/5 rounded-[16px] p-4">
          <p className="font-bold text-[12px]">API 구조!</p>
          <div className="mt-2 grid md:grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="bg-[#fafaf8] rounded-[8px] p-2"><p className="font-bold">POST /api/international/orders/upload</p><p className="opacity-60">엑셀 업로드 - 송장 품명, 수취인, HS CODE!</p></div>
            <div className="bg-[#fafaf8] rounded-[8px] p-2"><p className="font-bold">GET /api/international/orders</p><p className="opacity-60">?tracking=FLEXJP001 → 주문 조회!</p><p className="opacity-60">?mawb=180-12345678 → MAWB로 조회!</p></div>
            <div className="bg-[#fafaf8] rounded-[8px] p-2"><p className="font-bold">PUT /api/international/orders/[tracking]</p><p className="opacity-60">TRACKING NUMBER로 주문 수정! 송장 품명, HS CODE 등!</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}

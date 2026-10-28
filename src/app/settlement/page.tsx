"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function SettlementProPageFixed() {
  const [mounted, setMounted] = useState(false);
  const [sellerFilter, setSellerFilter] = useState("ALL");
  const [monthFilter, setMonthFilter] = useState("2024-10");
  const [settlements, setSettlements] = useState<any[]>([
    { id: "1", seller: "브랜드A", sku: "EAR-001", product_name: "무선 이어폰 Pro ANC 노이즈캔슬링 블랙", invoice_name: "무선이어폰 / 블랙", qty: 50, unit_price: 59000, total_sales: 2950000, fee_rate: 10, fee: 295000, shipping: 50, shipping_fee: 3000, shipping_total: 150000, consolidation_save: 5, consolidation_save_fee: 15000, final_settlement: 2520000, orders: ["20241027-001"] },
    { id: "2", seller: "브랜드A", sku: "WATCH-02", product_name: "스마트 워치 Series 8 45mm 실버", invoice_name: "스마트워치 S8 45mm", qty: 20, unit_price: 350000, total_sales: 7000000, fee_rate: 10, fee: 700000, shipping: 20, shipping_fee: 3000, shipping_total: 60000, consolidation_save: 2, consolidation_save_fee: 6000, final_settlement: 6254000, orders: ["20241027-002"] },
    { id: "3", seller: "브랜드C", sku: "COS-001", product_name: "에센스 100ml 히알루론산 수분", invoice_name: "수분에센스 100ml", qty: 100, unit_price: 29000, total_sales: 2900000, fee_rate: 12, fee: 348000, shipping: 100, shipping_fee: 3000, shipping_total: 300000, consolidation_save: 10, consolidation_save_fee: 30000, final_settlement: 2282000, orders: ["20241027-003"] },
  ]);

  useEffect(()=>{ setMounted(true); }, []);

  const filtered = settlements.filter(s=> (sellerFilter==="ALL" || s.seller===sellerFilter));
  const totalSales = filtered.reduce((sum,s)=>sum+s.total_sales,0);
  const totalFee = filtered.reduce((sum,s)=>sum+s.fee,0);
  const totalShipping = filtered.reduce((sum,s)=>sum+s.shipping_total,0);
  const totalSave = filtered.reduce((sum,s)=>sum+s.consolidation_save_fee,0);
  const totalSettlement = filtered.reduce((sum,s)=>sum+s.final_settlement,0);

  const exportExcel = () => {
    alert(`엑셀 다운로드! ${monthFilter} 정산서.xlsx - 송장 품명 기준!`);
  };

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">정산 Pro - 송장 품명 기준</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">송장 품명 + 합포장 절약</span></div></div>

        <div className="mt-6 flex gap-2 items-center flex-wrap">
          <select value={sellerFilter} onChange={e=>setSellerFilter(e.target.value)} className="border border-black/10 rounded-full px-4 py-2 text-[12px]"><option value="ALL">전체 셀러</option><option value="브랜드A">브랜드A</option><option value="브랜드C">브랜드C</option></select>
          <select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} className="border border-black/10 rounded-full px-4 py-2 text-[12px]"><option value="2024-10">2024년 10월</option><option value="2024-09">2024년 9월</option></select>
          <button onClick={exportExcel} className="ml-auto bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold">엑셀 다운로드 - {monthFilter} 정산서</button>
        </div>

        <div className="mt-6 grid md:grid-cols-5 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">총 매출</p><p className="text-[20px] font-black mt-1">{totalSales.toLocaleString()}원</p></div>
          <div className="bg-red-50 border border-red-200 rounded-[16px] p-5"><p className="text-[11px] opacity-60">수수료</p><p className="text-[20px] font-black mt-1 text-red-700">-{totalFee.toLocaleString()}원</p></div>
          <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-5"><p className="text-[11px] opacity-60">배송비</p><p className="text-[20px] font-black mt-1 text-amber-700">-{totalShipping.toLocaleString()}원</p></div>
          <div className="bg-green-50 border border-green-200 rounded-[16px] p-5"><p className="text-[11px] opacity-60">합포장 절약</p><p className="text-[20px] font-black mt-1 text-green-700">+{totalSave.toLocaleString()}원</p><p className="text-[10px] opacity-50 mt-1">{filtered.reduce((s,x)=>s+x.consolidation_save,0)}건 절약</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">최종 정산액</p><p className="text-[20px] font-black mt-1">{totalSettlement.toLocaleString()}원</p></div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">셀러 / 송장 품명</th><th className="text-center">수량 / 매출</th><th className="text-center">수수료 / 배송비</th><th className="text-center">합포장 절약</th><th className="text-center">정산액</th></tr></thead>
            <tbody>{filtered.map(s=><tr key={s.id} className="border-b"><td className="py-4 px-6"><p className="text-[10px] opacity-50">{s.seller}</p><p className="font-black text-[13px] mt-1">📦 {s.invoice_name} x{s.qty}</p><p className="text-[11px] opacity-50">내부: {s.product_name}</p></td><td className="text-center"><p className="font-bold">{s.qty}개 x {s.unit_price.toLocaleString()}원</p><p className="text-[11px] font-black mt-1">{s.total_sales.toLocaleString()}원</p></td><td className="text-center"><p className="text-[11px]">수수료 {s.fee_rate}퍼센트: -{s.fee.toLocaleString()}원</p><p className="text-[11px] mt-1">배송비 {s.shipping}건: -{s.shipping_total.toLocaleString()}원</p></td><td className="text-center"><p className="font-bold text-green-600">{s.consolidation_save}건 절약</p><p className="text-[11px] text-green-600">+{s.consolidation_save_fee.toLocaleString()}원</p></td><td className="text-center"><p className="font-black text-[14px]">{s.final_settlement.toLocaleString()}원</p></td></tr>)}</tbody>
            <tfoot className="bg-black text-white font-bold"><tr><td className="py-4 px-6">합계 - {monthFilter}</td><td className="text-center">{totalSales.toLocaleString()}원</td><td className="text-center">-{totalFee.toLocaleString()}원 / -{totalShipping.toLocaleString()}원</td><td className="text-center text-green-300">+{totalSave.toLocaleString()}원</td><td className="text-center">{totalSettlement.toLocaleString()}원</td></tr></tfoot>
          </table>
        </div>
      </main>
    </div>
  );
}

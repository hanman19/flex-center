"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import TopNav from "@/components/TopNav";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function AdminWMSPage() {
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", sku: "EAR-001", product_name: "무선 이어폰 Pro", qty: 2, location: "A-01-02", status: "피킹대기", wave: "WAVE-1" },
    { id: "2", order_no: "20241027-002", sku: "WATCH-02", product_name: "스마트 워치", qty: 1, location: "B-02-05", status: "피킹중", wave: "WAVE-1" },
    { id: "3", order_no: "20241027-003", sku: "COS-001", product_name: "에센스 100ml", qty: 1, location: "A-02-01", status: "패킹중", wave: "WAVE-2" },
  ]);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">작업자 WMS Pro</h1><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black">김포센터 · STAFF ONLY</span></div>
        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">WAVE 피킹 리스트</h3><span className="text-[11px] opacity-50">오늘 {orders.length}건</span></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">주문/상품</th><th>위치</th><th>수량</th><th>상태</th><th>WAVE</th><th>액션</th></tr></thead>
            <tbody>{orders.map(o=>(
              <tr key={o.id} className="border-b"><td className="py-3 px-6"><p className="font-mono text-[11px]">{o.order_no}</p><p className="font-bold">{o.product_name}</p></td><td className="text-center"><span className="bg-black text-white px-2 py-1 rounded-full text-[11px]">{o.location}</span></td><td className="text-center">{o.qty}</td><td className="text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px]">{o.status}</span></td><td className="text-center">{o.wave}</td><td className="text-center"><button className="bg-black text-white px-3 py-1 rounded-full text-[11px]">피킹</button></td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mt-6 bg-black text-white rounded-[16px] p-6"><p className="font-bold text-[13px]">PDA 바코드 스캔 지원</p><p className="text-[11px] opacity-60 mt-2">휴대폰, Zebra, Honeywell, USB 스캐너 모두 키보드 입력으로 처리. 스캔하면 자동으로 피킹 확인!</p></div>
      </main>
    </div>
  );
}

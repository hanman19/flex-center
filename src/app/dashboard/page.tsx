"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function DashboardProPage() {
  const [stats, setStats] = useState({ todayOrders: 0, pendingPick: 0, lowStock: 0, totalSales: 0 });
  const [lowStockItems, setLowStockItems] = useState<any[]>([
    { sku: "COS-001", product_name: "에센스 100ml", invoice_name: "수분에센스 100ml", stock: 8, safety: 20, location: "A-02-01" },
    { sku: "EAR-001", product_name: "무선 이어폰 Pro", invoice_name: "무선이어폰 / 블랙", stock: 15, safety: 30, location: "A-01-02" },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([
    { order_no: "20241027-001", invoice_name: "무선이어폰 / 블랙 x2", recipient: "김*수", status: "합포장완료", time: "10:23" },
  ]);

  useEffect(() => {
    setStats({ todayOrders: 127, pendingPick: 23, lowStock: 2, totalSales: 4500000 });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">대시보드 Pro</h1><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">실시간</span></div>
        <div className="mt-6 grid md:grid-cols-4 gap-3">
          <div className="bg-white border rounded-[16px] p-5"><p className="text-[11px] opacity-40">오늘 주문</p><p className="text-[28px] font-black">{stats.todayOrders}건</p></div>
          <div className="bg-amber-50 border rounded-[16px] p-5"><p className="text-[11px]">피킹대기</p><p className="text-[28px] font-black">{stats.pendingPick}건</p></div>
          <div className="bg-red-50 border rounded-[16px] p-5"><p className="text-[11px]">재고 부족</p><p className="text-[28px] font-black">{stats.lowStock}건</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">오늘 매출</p><p className="text-[28px] font-black">{stats.totalSales.toLocaleString()}원</p></div>
        </div>
        <div className="mt-6 bg-white border rounded-[16px] p-6">
          <h3 className="font-bold">최근 주문</h3>
          {recentOrders.map(o=><div key={o.order_no} className="flex justify-between border-b py-3"><p className="font-bold text-[13px]">{o.invoice_name}</p><span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">{o.status}</span></div>)}
        </div>
      </main>
    </div>
  );
}

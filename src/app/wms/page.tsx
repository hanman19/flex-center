"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import TopNav from "@/components/TopNav";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function WMSPage() {
  const [session, setSession] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([
    { id: "1", sku: "EAR-001", product_name: "무선 이어폰", qty: 150, location: "A-01-02", box_count: 3, inbound_date: "2024-10-20", status: "보관중" },
    { id: "2", sku: "WATCH-02", product_name: "스마트 워치", qty: 45, location: "B-02-05", box_count: 1, inbound_date: "2024-10-22", status: "보관중" },
    { id: "3", sku: "CASE-04", product_name: "에어팟 케이스", qty: 320, location: "A-01-03", box_count: 2, inbound_date: "2024-10-26", status: "보관중" },
  ]);
  const [tab, setTab] = useState<"stock" | "inbound" | "outbound">("stock");

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold tracking-tight">내 창고 현황</h1>
        <p className="text-[13px] opacity-60 mt-1">김포 FLEX CENTER에 보관중인 내 재고</p>
        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">내 상품 / SKU</th><th className="text-center">위치</th><th className="text-center">수량</th><th className="text-center">상태</th></tr></thead>
            <tbody>
              {inventory.map(i=>(
                <tr key={i.id} className="border-b border-black/[0.03]"><td className="py-4 px-6"><p className="font-bold">{i.product_name}</p><p className="font-mono text-[10px] opacity-50">{i.sku}</p></td><td className="text-center"><span className="font-mono bg-black text-white px-3 py-1 rounded-full text-[11px]">{i.location}</span></td><td className="text-center font-bold">{i.qty}개</td><td className="text-center"><span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full">{i.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

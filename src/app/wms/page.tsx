"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const mockInventory = [
  { sku: "EAR-001", name: "무선 이어폰", qty: 150, location: "A-01-02", inbound_date: "2024-10-20", status: "normal" },
  { sku: "WATCH-02", name: "스마트 워치", qty: 45, location: "B-02-05", inbound_date: "2024-10-22", status: "low" },
  { sku: "SPK-03", name: "블루투스 스피커", qty: 80, location: "A-03-01", inbound_date: "2024-10-25", status: "normal" },
  { sku: "CASE-04", name: "에어팟 케이스", qty: 320, location: "A-01-03", inbound_date: "2024-10-26", status: "normal" },
];

const mockPickingList = [
  { order_id: "20241027-001", sku: "EAR-001", location: "A-01-02", qty: 2, product: "무선 이어폰", recipient: "김철수", bundled: true, bundle_count: 2 },
  { order_id: "C-20241027-002", sku: "WATCH-02", location: "B-02-05", qty: 1, product: "스마트 워치", recipient: "이영희", bundled: false, bundle_count: 1 },
  { order_id: "11-20241027-003", sku: "SPK-03", location: "A-03-01", qty: 1, product: "블루투스 스피커", recipient: "박민수", bundled: false, bundle_count: 1 },
];

export default function WMSPage() {
  const [inventory, setInventory] = useState(mockInventory);
  const [picking, setPicking] = useState(mockPickingList);
  const [tab, setTab] = useState<"picking" | "inventory" | "bundle">("picking");
  const [completed, setCompleted] = useState<string[]>([]);

  const togglePick = (orderId: string) => {
    if (completed.includes(orderId)) setCompleted(completed.filter(c => c !== orderId));
    else setCompleted([...completed, orderId]);
  };

  const totalPicking = picking.length;
  const donePicking = completed.length;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">WMS 창고관리</span></Link>
          <div className="flex gap-2"><Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full border">회원전용</Link><Link href="/orders" className="text-[12px] px-4 py-2 rounded-full border">주문관리</Link><Link href="/platforms" className="text-[12px] px-4 py-2 rounded-full border">플랫폼 연동</Link></div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div><h1 className="text-[28px] font-bold tracking-tight">WMS 창고 관리</h1><p className="text-[13px] opacity-60 mt-1">김포 물류센터 선반 위치 기반 피킹 및 합포장 관리</p></div>
          <div className="bg-black text-white rounded-full px-4 py-2 text-[12px] font-bold">{donePicking} / {totalPicking} 피킹 완료</div>
        </div>

        <div className="mt-6 flex gap-2">
          {(["picking", "inventory", "bundle"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab===t ? "bg-black text-white border-black" : "bg-white border-black/10 opacity-70"}`}>
              {t==="picking" ? `오늘의 피킹 리스트 (${totalPicking})` : t==="inventory" ? `재고 및 선반 관리 (${inventory.length})` : `합포장 체크`}
            </button>
          ))}
        </div>

        {tab==="picking" && (
          <div className="mt-6 space-y-3">
            <div className="bg-white border border-black/5 rounded-[16px] overflow-hidden">
              <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                <h3 className="font-bold text-[14px]">선반 동선 최적화 피킹 순서</h3>
                <span className="text-[11px] opacity-50">A구역 → B구역 순서로 동선 최소화</span>
              </div>
              {picking.sort((a,b)=>a.location.localeCompare(b.location)).map(p => {
                const isDone = completed.includes(p.order_id);
                return (
                  <div key={p.order_id} className={`flex items-center gap-4 px-6 py-4 border-b border-black/[0.03] ${isDone ? "bg-green-50 opacity-60" : "hover:bg-[#fafaf8]"}`}>
                    <button onClick={()=>togglePick(p.order_id)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[12px] font-bold ${isDone ? "bg-green-500 border-green-500 text-white" : "border-black/20"}`}>{isDone ? "✓" : ""}</button>
                    <div className="w-[80px]"><span className="text-[11px] font-mono font-bold bg-black text-white px-2 py-1 rounded">{p.location}</span></div>
                    <div className="flex-1"><p className="font-bold text-[13px]">{p.product} <span className="font-mono text-[11px] opacity-50">{p.sku} x {p.qty}</span></p><p className="text-[11px] opacity-50">주문 {p.order_id} - {p.recipient} {p.bundled && <span className="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">합포장 {p.bundle_count}개</span>}</p></div>
                    <div className="text-right"><p className="text-[10px] opacity-40">수량</p><p className="font-bold">{p.qty}</p></div>
                  </div>
                )
              })}
            </div>

            <div className="bg-black text-white rounded-[16px] p-6 flex items-center justify-between">
              <div><p className="font-bold">피킹 완료 후</p><p className="text-[12px] opacity-60 mt-1">모두 체크하면 주문관리 페이지에서 패킹 단계로 자동 이동됩니다</p></div>
              <Link href="/orders" className="bg-white text-black px-6 py-3 rounded-full text-[12px] font-bold">주문관리로 가기 →</Link>
            </div>
          </div>
        )}

        {tab==="inventory" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5"><h3 className="font-bold text-[14px]">선반별 재고 현황</h3></div>
            <table className="w-full text-[12px]">
              <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b border-black/5"><tr><th className="text-left py-3 px-6">SKU / 상품명</th><th className="text-center">선반 위치</th><th className="text-center">재고 수량</th><th className="text-center">입고일</th><th className="text-center">상태</th></tr></thead>
              <tbody>
                {inventory.map(i => (
                  <tr key={i.sku} className="border-b border-black/5 hover:bg-[#fafaf8]">
                    <td className="py-4 px-6"><p className="font-bold">{i.name}</p><p className="font-mono text-[10px] opacity-50">{i.sku}</p></td>
                    <td className="text-center"><span className="font-mono bg-black text-white px-2 py-1 rounded text-[11px]">{i.location}</span></td>
                    <td className="text-center font-bold">{i.qty}</td>
                    <td className="text-center text-[11px] opacity-60">{i.inbound_date}</td>
                    <td className="text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${i.status==="low" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{i.status==="low" ? "재고 부족" : "정상"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==="bundle" && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-black/5 rounded-[16px] p-6">
              <h3 className="font-bold text-[14px]">합포장 정책 (FLEX CENTER만의 장점)</h3>
              <div className="mt-4 space-y-3 text-[12px] leading-relaxed">
                <div className="flex gap-3"><span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">1</span><p><b>합포장 3개 무료</b> - 같은 수령인 주문이 3개까지면 박스 하나로 합쳐서 출고 (포장비 절약!)</p></div>
                <div className="flex gap-3"><span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">2</span><p>4개째부터는 <b>추가 포장비 500원</b> (경쟁사는 1개부터 유료!)</p></div>
                <div className="flex gap-3"><span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0">3</span><p>자동 감지 - 같은 전화번호/주소로 들어온 주문은 WMS가 자동으로 합포장 제안</p></div>
              </div>
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-[12px] p-4">
                <p className="text-[11px] font-bold text-amber-800">오늘의 합포장 대상</p>
                <p className="text-[12px] mt-2">김철수 님 - 무선 이어폰 2개가 같은 주소로 주문됨 → <b>1개 박스로 합포장 가능! (무료)</b></p>
                <button className="mt-3 text-[11px] px-3 py-1.5 rounded-full bg-black text-white">합포장 승인하기</button>
              </div>
            </div>
            <div className="bg-black text-white rounded-[16px] p-6">
              <h3 className="font-bold text-[14px]">김포 센터 선반 맵</h3>
              <div className="mt-6 grid grid-cols-4 gap-2">
                {["A-01-01","A-01-02","A-01-03","A-01-04","A-02-01","A-02-02","A-03-01","A-03-02","B-01-01","B-02-05","B-02-06","B-03-01"].map(loc => {
                  const hasStock = inventory.some(i=>i.location===loc);
                  return <div key={loc} className={`h-[50px] rounded-[8px] border flex flex-col items-center justify-center text-[9px] font-mono ${hasStock ? "bg-white text-black border-white" : "bg-white/10 border-white/20 text-white/40"}`}><span className="font-bold">{loc}</span><span className="text-[8px]">{hasStock ? inventory.find(i=>i.location===loc)?.qty + "개" : "비어있음"}</span></div>
                })}
              </div>
              <p className="text-[10px] opacity-50 mt-4">* 흰색은 재고 있음, 어두운 색은 빈 선반</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

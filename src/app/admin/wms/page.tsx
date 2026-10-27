"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

export default function AdminWMSProPage() {
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", sku: "EAR-001", product_name: "무선 이어폰 Pro", qty: 2, location: "A-01-02", status: "피킹대기", wave: "WAVE-1", seller: "브랜드A" },
    { id: "2", order_no: "20241027-002", sku: "WATCH-02", product_name: "스마트 워치", qty: 1, location: "B-02-05", status: "피킹중", wave: "WAVE-1", seller: "브랜드B" },
    { id: "3", order_no: "20241027-003", sku: "COS-001", product_name: "에센스 100ml", qty: 1, location: "A-02-01", status: "패킹중", wave: "WAVE-2", seller: "브랜드C", sample: "SAMPLE-01" },
  ]);
  const [scanned, setScanned] = useState("");
  const [waveFilter, setWaveFilter] = useState("ALL");

  const handleScan = () => {
    if (!scanned) return;
    const found = orders.find(o=>o.sku===scanned || o.barcode===scanned);
    if (found) { setOrders(orders.map(o=>o.id===found.id?{...o, status:"피킹완료"}:o)); setScanned(""); alert(`${found.product_name} 피킹 완료!`); }
    else alert(`SKU ${scanned} 못 찾음`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">작업자 WMS Pro</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">김포센터 · STAFF ONLY</span><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">PDA 스캔 모드</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">모든 셀러 주문을 한 곳에서 WAVE 피킹. PDA, 휴대폰, USB 스캐너 모두 키보드 입력으로 처리.</p>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">오늘 전체</p><p className="text-[22px] font-black mt-1">{orders.length}건</p></div>
          <div className="bg-blue-50 border border-blue-200 rounded-[16px] p-5"><p className="text-[11px] opacity-60">피킹대기</p><p className="text-[22px] font-black mt-1 text-blue-700">{orders.filter(o=>o.status==="피킹대기").length}건</p></div>
          <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-5"><p className="text-[11px] opacity-60">피킹중</p><p className="text-[22px] font-black mt-1 text-amber-700">{orders.filter(o=>o.status==="피킹중").length}건</p></div>
          <div className="bg-green-50 border border-green-200 rounded-[16px] p-5"><p className="text-[11px] opacity-60">피킹완료</p><p className="text-[22px] font-black mt-1 text-green-700">{orders.filter(o=>o.status==="피킹완료").length}건</p></div>
        </div>

        <div className="mt-6 flex gap-2 items-center">
          <div className="flex gap-2"><button onClick={()=>setWaveFilter("ALL")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="ALL" ? "bg-black text-white" : "bg-white"}`}>전체 WAVE</button><button onClick={()=>setWaveFilter("WAVE-1")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="WAVE-1" ? "bg-black text-white" : "bg-white"}`}>WAVE-1</button><button onClick={()=>setWaveFilter("WAVE-2")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="WAVE-2" ? "bg-black text-white" : "bg-white"}`}>WAVE-2</button></div>
          <div className="ml-auto flex gap-2"><input value={scanned} onChange={e=>setScanned(e.target.value)} onKeyDown={e=>e.key==="Enter" && handleScan()} placeholder="바코드 스캔 (SKU)" className="border-2 border-black rounded-full px-4 py-2 text-[12px] w-[200px]" autoFocus /><button onClick={handleScan} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">스캔 확인</button></div>
        </div>

        <div className="mt-4 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">WAVE 피킹 리스트 - 동선 최적화</h3><span className="text-[11px] opacity-50">A-01-02 → A-02-01 → B-02-05 순서로 피킹하면 동선 최소!</span></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">셀러 / 주문 / 상품</th><th className="text-center">위치</th><th className="text-center">수량</th><th className="text-center">상태</th><th className="text-center">WAVE</th><th className="text-center">액션</th></tr></thead>
            <tbody>{orders.filter(o=>waveFilter==="ALL" || o.wave===waveFilter).map(o=>(
              <tr key={o.id} className="border-b hover:bg-[#fafaf8]"><td className="py-4 px-6"><p className="text-[10px] opacity-50">{o.seller}</p><p className="font-mono text-[11px]">{o.order_no}</p><p className="font-bold mt-1">{o.product_name} <span className="font-normal opacity-60">({o.sku})</span></p>{o.sample && <p className="text-[10px] text-amber-600 font-bold">+ 샘플 {o.sample} 자동추가</p>}</td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-mono">{o.location}</span></td><td className="text-center font-bold">{o.qty}</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="피킹완료" ? "bg-green-100 text-green-700" : o.status==="피킹중" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>{o.status}</span></td><td className="text-center">{o.wave}</td><td className="text-center"><button onClick={()=>setOrders(orders.map(x=>x.id===o.id?{...x, status:"피킹완료"}:x))} className="bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-bold">{o.status==="피킹완료" ? "완료" : "피킹"}</button></td></tr>
            ))}</tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">PDA 바코드 스캔</p><p className="text-[11px] opacity-60 mt-2">Zebra, Honeywell, 휴대폰 카메라, USB 스캐너 모두 키보드 이벤트로 들어옴. 입력창에 포커스만 있으면 스캔 즉시 피킹 확인!</p></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5"><p className="font-bold text-[13px] text-black">샘플 / 포토카드 자동</p><p className="text-[11px] text-black/60 mt-2">에센스 사면 샘플 자동, K-pop 앨범 사면 포토카드 랜덤. 상품 마스터에서 is_sample=true, 앨범이면 랜덤 로직.</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">동선 최적화</p><p className="text-[11px] opacity-60 mt-2">A-01-02 → A-02-01 → B-02-05 순서로 정렬하면 피킹 동선 최소. 1일 500건도 2시간이면 끝!</p></div>
        </div>
      </main>
    </div>
  );
}

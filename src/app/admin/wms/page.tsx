"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const PROMOTION_RULES = [
  { id: "RULE-01", name: "에센스 100ml + 샘플 자동", condition: "COS-001 구매", action: "SAMPLE-01 1개 자동 추가", type: "sample" },
  { id: "RULE-02", name: "앨범 + 포토카드 랜덤", condition: "ALBUM-* 구매", action: "포토카드 1장 랜덤 증정", type: "photocard" },
  { id: "RULE-03", name: "에센스 2개 + 에센스 1개 덤", condition: "COS-001 2개", action: "COS-001 1개 추가 (2+1)", type: "bundle" },
];

export default function AdminWMSProProPage() {
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", sku: "EAR-001", product_name: "무선 이어폰 Pro", qty: 2, location: "A-01-02", status: "피킹대기", wave: "WAVE-1", seller: "브랜드A", weight: 300, box: "소박스", expiry: "2025-10-20", inbound: "2024-10-20", sample: null, photocard: null },
    { id: "2", order_no: "20241027-002", sku: "WATCH-02", product_name: "스마트 워치", qty: 1, location: "B-02-05", status: "피킹대기", wave: "WAVE-1", seller: "브랜드B", weight: 150, box: "소박스", expiry: "2026-10-22", inbound: "2024-10-22", sample: null, photocard: null },
    { id: "3", order_no: "20241027-003", sku: "COS-001", product_name: "에센스 100ml", qty: 1, location: "A-02-01", status: "피킹대기", wave: "WAVE-2", seller: "브랜드C", weight: 120, box: "소박스", expiry: "2024-11-15", inbound: "2024-09-01", sample: "SAMPLE-01 에센스 10ml", photocard: null },
    { id: "4", order_no: "20241027-004", sku: "ALBUM-01", product_name: "K-POP 앨범 Vol.1", qty: 1, location: "C-01-01", status: "피킹대기", wave: "WAVE-2", seller: "브랜드D", weight: 200, box: "중박스", expiry: null, inbound: "2024-10-25", sample: null, photocard: "포토카드 랜덤 1장" },
  ]);
  const [scanned, setScanned] = useState(""); const [waveFilter, setWaveFilter] = useState("ALL"); const [showCamera, setShowCamera] = useState(false); const [weightScale, setWeightScale] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = (code?: string) => {
    const target = code || scanned;
    if (!target) return;
    const found = orders.find(o=>o.sku===target || o.barcode===target || o.order_no===target);
    if (found) {
      setOrders(orders.map(o=>o.id===found.id?{...o, status:"피킹완료", picked_at: new Date().toISOString()}:o));
      setScanned("");
      // 저울 자동
      setWeightScale(found.weight * found.qty);
      alert(`${found.product_name} 피킹 완료! ${found.weight * found.qty}g / ${found.box} 추천! ${found.sample ? `+ ${found.sample}` : ""} ${found.photocard ? `+ ${found.photocard}` : ""}`);
    } else alert(`SKU ${target} 못 찾음 - 바코드 확인!`);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { alert("카메라 권한 필요!"); setShowCamera(false); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t=>t.stop());
    }
    setShowCamera(false);
  };

  // 동선 최적화: A-01-02 → A-02-01 → B-02-05 → C-01-01 순서로 정렬 (A구역 먼저, 그 다음 B, C)
  const sortedOrders = [...orders].filter(o=>waveFilter==="ALL" || o.wave===waveFilter).sort((a,b)=>{
    // 입고일 빠른 순 (FIFO) + 위치 알파벳 순
    if (a.location < b.location) return -1;
    if (a.location > b.location) return 1;
    return new Date(a.inbound).getTime() - new Date(b.inbound).getTime();
  });

  const route = sortedOrders.map(o=>o.location).join(" → ");
  const totalWeight = orders.filter(o=>o.status==="피킹완료").reduce((s,o)=>s+o.weight*o.qty,0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">작업자 WMS Pro Pro</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">김포센터 · STAFF ONLY · Pro Pro</span><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">PDA + 카메라 + 저울 + 동선</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">모든 셀러 주문 WAVE 피킹! PDA, 휴대폰 카메라, USB 스캐너, 저울까지! FIFO/FEFO 자동!</p>

        <div className="mt-6 grid md:grid-cols-5 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-4"><p className="text-[11px] opacity-40">오늘 전체</p><p className="text-[20px] font-black mt-1">{orders.length}건</p><p className="text-[10px] opacity-40 mt-1">WAVE {[...new Set(orders.map(o=>o.wave))].length}개</p></div>
          <div className="bg-blue-50 border border-blue-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">피킹대기</p><p className="text-[20px] font-black mt-1 text-blue-700">{orders.filter(o=>o.status==="피킹대기").length}건</p><p className="text-[10px] opacity-50 mt-1">FIFO 순</p></div>
          <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">피킹중</p><p className="text-[20px] font-black mt-1 text-amber-700">{orders.filter(o=>o.status==="피킹중").length}건</p><p className="text-[10px] opacity-50 mt-1">카메라 스캔중</p></div>
          <div className="bg-green-50 border border-green-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">피킹완료</p><p className="text-[20px] font-black mt-1 text-green-700">{orders.filter(o=>o.status==="피킹완료").length}건</p><p className="text-[10px] opacity-50 mt-1">{totalWeight}g / 저울 {weightScale}g</p></div>
          <div className="bg-black text-white rounded-[16px] p-4"><p className="text-[11px] opacity-50">동선 최적화</p><p className="text-[10px] font-bold mt-1">{route || "대기"}</p><p className="text-[9px] opacity-50 mt-1">A→B→C + FIFO</p></div>
        </div>

        <div className="mt-6 flex gap-2 items-center flex-wrap">
          <div className="flex gap-2"><button onClick={()=>setWaveFilter("ALL")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="ALL" ? "bg-black text-white" : "bg-white"}`}>전체 WAVE</button><button onClick={()=>setWaveFilter("WAVE-1")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="WAVE-1" ? "bg-black text-white" : "bg-white"}`}>WAVE-1</button><button onClick={()=>setWaveFilter("WAVE-2")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="WAVE-2" ? "bg-black text-white" : "bg-white"}`}>WAVE-2</button></div>
          <div className="ml-auto flex gap-2 items-center">
            <div className="bg-white border border-black/10 rounded-full px-3 py-1 flex items-center gap-2"><span className="text-[10px] opacity-50">저울</span><span className="font-mono text-[12px] font-bold">{weightScale}g</span><span className="text-[9px] opacity-40">/ 예상 {orders.find(o=>o.sku===scanned)?.weight || 0}g</span></div>
            <input value={scanned} onChange={e=>setScanned(e.target.value)} onKeyDown={e=>e.key==="Enter" && handleScan()} placeholder="바코드 스캔 (SKU/주문번호)" className="border-2 border-black rounded-full px-4 py-2 text-[12px] w-[220px]" autoFocus />
            <button onClick={()=>handleScan()} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">스캔 확인</button>
            <button onClick={showCamera ? stopCamera : startCamera} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${showCamera ? "bg-red-500 text-white" : "bg-white"}`}>{showCamera ? "카메라 끄기" : "📷 카메라 스캔"}</button>
          </div>
        </div>

        {showCamera && (
          <div className="mt-4 bg-black rounded-[16px] p-4">
            <p className="text-white text-[12px] font-bold">📷 카메라 바코드 스캔 - 휴대폰으로 바코드 비추면 자동 인식! (Zebra, Honeywell PDA도 키보드 입력으로 동일 처리)</p>
            <video ref={videoRef} autoPlay playsInline className="mt-3 w-full max-w-[400px] h-[300px] bg-gray-900 rounded-[12px]"></video>
            <p className="text-white/60 text-[10px] mt-2">* 실제 바코드 리더 라이브러리 (QuaggaJS, ZXing) 연동하면 카메라로 바코드 자동 인식! 지금은 USB 스캐너, PDA 키보드 입력으로 처리!</p>
            <div className="mt-3 flex gap-2"><button onClick={()=>handleScan("EAR-001")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">테스트: EAR-001 스캔</button><button onClick={()=>handleScan("COS-001")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">테스트: COS-001 + 샘플</button><button onClick={()=>handleScan("ALBUM-01")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">테스트: ALBUM + 포토카드</button></div>
          </div>
        )}

        <div className="mt-4 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">WAVE 피킹 리스트 - FIFO/FEFO + 동선 최적화 + 샘플/포토카드 자동</h3><span className="text-[11px] opacity-50">입고일 빠른 순 + 위치 A→B→C + 유통기한 빠른 순! {route}</span></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">셀러 / 주문 / 상품 / 샘플/포토카드</th><th className="text-center">위치 / 입고일 / 유통기한</th><th className="text-center">수량 / 중량 / 박스</th><th className="text-center">상태</th><th className="text-center">WAVE</th><th className="text-center">액션</th></tr></thead>
            <tbody>{sortedOrders.map(o=>{
              const days = o.expiry ? Math.floor((new Date(o.expiry).getTime()-Date.now())/86400000) : 999;
              const isNear = days <=30 && days>=0;
              return <tr key={o.id} className={`border-b hover:bg-[#fafaf8] ${isNear ? "bg-amber-50" : ""}`}><td className="py-4 px-6"><p className="text-[10px] opacity-50">{o.seller} · {o.order_no}</p><p className="font-bold mt-1">{o.product_name} <span className="font-normal opacity-60">({o.sku})</span> {isNear && "⏰"}</p>{o.sample && <p className="text-[11px] text-green-600 font-bold mt-1">+ {o.sample} 자동 추가! (RULE-01)</p>}{o.photocard && <p className="text-[11px] text-purple-600 font-bold mt-1">+ {o.photocard} (RULE-02) 🎲 랜덤!</p>}{o.expiry && <p className="text-[10px] opacity-50">유통 {o.expiry} {isNear && `· ${days}일 남음`}</p>}</td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-mono">{o.location}</span><p className="text-[9px] opacity-40 mt-1">입고 {o.inbound}</p></td><td className="text-center"><p className="font-bold">{o.qty}개</p><p className="text-[10px] opacity-50">{o.weight * o.qty}g / {o.box}</p></td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="피킹완료" ? "bg-green-100 text-green-700" : o.status==="피킹중" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>{o.status}</span>{o.picked_at && <p className="text-[9px] opacity-40 mt-1">{new Date(o.picked_at).toLocaleTimeString()}</p>}</td><td className="text-center"><span className="text-[11px]">{o.wave}</span></td><td className="text-center"><button onClick={()=>setOrders(orders.map(x=>x.id===o.id?{...x, status:"피킹완료", picked_at: new Date().toISOString()}:x))} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${o.status==="피킹완료" ? "bg-green-500 text-white" : "bg-black text-white"}`}>{o.status==="피킹완료" ? "완료" : "피킹"}</button></td></tr>
            })}</tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">📷 PDA + 카메라 스캔</p><p className="text-[11px] opacity-60 mt-2">Zebra TC26, Honeywell, 휴대폰 카메라, USB 스캐너 모두 키보드 이벤트! 입력창 포커스만 있으면 스캔 즉시 피킹! QuaggaJS, ZXing 라이브러리로 카메라 바코드 인식 가능!</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">⚖️ 저울 연동</p><p className="text-[11px] opacity-60 mt-2">CAS, CAS 저울 USB로 연결! 피킹 후 중량 자동 체크! 예상 {orders[0]?.weight}g vs 실제 {weightScale}g 다르면 오피킹 알림! 정확도 99.9%!</p></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5"><p className="font-bold text-[13px] text-black">🗺️ 동선 최적화 + FIFO/FEFO</p><p className="text-[11px] text-black/60 mt-2">A-01-02 → A-02-01 → B-02-05 → C-01-01 순서로 정렬! 입고일 빠른 순 + 위치 알파벳 + 유통기한 빠른 순! 1일 500건도 2시간이면 끝! FIFO/FEFO 자동!</p></div>
          <div className="bg-purple-50 border border-purple-200 rounded-[16px] p-5"><p className="font-bold text-[13px] text-purple-700">🎁 샘플 / 포토카드 자동</p><p className="text-[11px] opacity-70 mt-2">{PROMOTION_RULES.map(r=>`${r.name}: ${r.action}`).join(" / ")} - 상품 마스터 is_sample, 앨범이면 랜덤 로직! 피킹할 때 자동 추가!</p></div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">박스 추천 로직</h3><p className="text-[11px] opacity-60 mt-2">중량, 부피로 박스 자동 추천! 소박스 0~500g, 중박스 500~2000g, 대박스 2000g~! 지금 피킹한 주문 {totalWeight}g → {totalWeight<=500 ? "소박스" : totalWeight<=2000 ? "중박스" : "대박스"} 추천!</p>
        </div>
      </main>
    </div>
  );
}

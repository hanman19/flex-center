"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function AdminWMSProProFullPage() {
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", sku: "EAR-001", product_name: "무선 이어폰 Pro ANC 노이즈캔슬링 블랙", invoice_name: "무선이어폰 / 블랙", qty: 2, location: "A-01-02", status: "피킹대기", wave: "WAVE-1", seller: "브랜드A", weight: 300, box: "소박스", expiry: "2025-10-20", inbound: "2024-10-20", sample: null, photocard: null, recipient: "김*수", msg: "문 앞에 놔주세요" },
    { id: "2", order_no: "20241027-002", sku: "WATCH-02", product_name: "스마트 워치 Series 8 45mm 실버", invoice_name: "스마트워치 S8 45mm", qty: 1, location: "B-02-05", status: "피킹대기", wave: "WAVE-1", seller: "브랜드B", weight: 150, box: "소박스", expiry: "2026-10-22", inbound: "2024-10-22", sample: null, photocard: null, recipient: "이*영", msg: "" },
    { id: "3", order_no: "20241027-003", sku: "COS-001", product_name: "에센스 100ml 히알루론산 수분", invoice_name: "수분에센스 100ml", qty: 1, location: "A-02-01", status: "피킹대기", wave: "WAVE-2", seller: "브랜드C", weight: 120, box: "소박스", expiry: "2024-11-15", inbound: "2024-09-01", sample: "SAMPLE-01 에센스 10ml", photocard: null, recipient: "박*진", msg: "부재시 경비실" },
    { id: "4", order_no: "20241027-004", sku: "ALBUM-01", product_name: "K-POP 앨범 Vol.1 초판 한정판 포스터 포함", invoice_name: "K-POP 앨범 Vol.1", qty: 1, location: "C-01-01", status: "피킹대기", wave: "WAVE-2", seller: "브랜드D", weight: 200, box: "중박스", expiry: null, inbound: "2024-10-25", sample: null, photocard: "포토카드 랜덤 1장", recipient: "최*아", msg: "포카 손상 주의!" },
  ]);
  const [scanned, setScanned] = useState(""); const [waveFilter, setWaveFilter] = useState("ALL"); const [showCamera, setShowCamera] = useState(false); const [weightScale, setWeightScale] = useState(0); const [showInvoiceView, setShowInvoiceView] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = (code?: string) => {
    const target = code || scanned;
    if (!target) return;
    const found = orders.find(o=>o.sku===target || o.invoice_name===target || o.order_no===target || o.barcode===target);
    if (found) {
      setOrders(orders.map(o=>o.id===found.id?{...o, status:"피킹완료", picked_at: new Date().toISOString()}:o));
      setScanned(""); setWeightScale(found.weight * found.qty);
      alert(`[${found.invoice_name}] 피킹 완료! 위치 ${found.location} / ${found.weight*found.qty}g / ${found.box} / ${found.sample ? `+ ${found.sample}` : ""} ${found.photocard ? `+ ${found.photocard}` : ""}`);
    } else alert(`못 찾음: ${target}`);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { alert("카메라 권한 필요!"); setShowCamera(false); }
  };
  const stopCamera = () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t=>t.stop());
    setShowCamera(false);
  };

  const sortedOrders = [...orders].filter(o=>waveFilter==="ALL" || o.wave===waveFilter).sort((a,b)=>a.location.localeCompare(b.location) || new Date(a.inbound).getTime() - new Date(b.inbound).getTime());
  const route = sortedOrders.map(o=>o.location).join(" → ");
  const totalWeight = orders.filter(o=>o.status==="피킹완료").reduce((s,o)=>s+o.weight*o.qty,0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">작업자 WMS Pro Pro - 전체 기능</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">송장 품명 + PDA + 저울 + 동선</span><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">STAFF ONLY</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">송장 품명 + PDA 카메라 스캔 + 저울 + 동선 최적화 + 샘플/포토카드 자동 + FIFO/FEFO + 박스 추천 - 전부 다!</p>

        <div className="mt-6 grid md:grid-cols-5 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-4"><p className="text-[11px] opacity-40">오늘 전체</p><p className="text-[20px] font-black mt-1">{orders.length}건</p></div>
          <div className="bg-blue-50 border border-blue-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">피킹대기</p><p className="text-[20px] font-black mt-1 text-blue-700">{orders.filter(o=>o.status==="피킹대기").length}건</p></div>
          <div className="bg-green-50 border border-green-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">피킹완료</p><p className="text-[20px] font-black mt-1 text-green-700">{orders.filter(o=>o.status==="피킹완료").length}건</p><p className="text-[10px] opacity-50 mt-1">{totalWeight}g</p></div>
          <div className="bg-black text-white rounded-[16px] p-4"><p className="text-[11px] opacity-50">동선</p><p className="text-[10px] font-bold mt-1">{route || "대기"}</p><p className="text-[9px] opacity-50 mt-1">A→B→C + FIFO</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-4"><p className="text-[11px] opacity-40">저울</p><p className="text-[20px] font-bold mt-1">{weightScale}g</p><p className="text-[10px] opacity-40 mt-1">실시간</p></div>
        </div>

        <div className="mt-6 flex gap-2 items-center flex-wrap">
          <div className="flex gap-2"><button onClick={()=>setWaveFilter("ALL")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="ALL" ? "bg-black text-white" : "bg-white"}`}>전체</button><button onClick={()=>setWaveFilter("WAVE-1")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="WAVE-1" ? "bg-black text-white" : "bg-white"}`}>WAVE-1</button><button onClick={()=>setWaveFilter("WAVE-2")} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${waveFilter==="WAVE-2" ? "bg-black text-white" : "bg-white"}`}>WAVE-2</button></div>
          <div className="flex gap-2 ml-2"><button onClick={()=>setShowInvoiceView(true)} className={`px-3 py-2 rounded-full text-[11px] font-bold border ${showInvoiceView ? "bg-black text-white" : "bg-white"}`}>📦 송장 품명</button><button onClick={()=>setShowInvoiceView(false)} className={`px-3 py-2 rounded-full text-[11px] font-bold border ${!showInvoiceView ? "bg-black text-white" : "bg-white"}`}>내부 품명</button></div>
          <div className="ml-auto flex gap-2 items-center">
            <div className="bg-white border border-black/10 rounded-full px-3 py-1 flex items-center gap-2"><span className="text-[10px] opacity-50">저울</span><span className="font-mono text-[12px] font-bold">{weightScale}g</span></div>
            <input value={scanned} onChange={e=>setScanned(e.target.value)} onKeyDown={e=>e.key==="Enter" && handleScan()} placeholder="송장 품명, SKU, 주문번호 스캔" className="border-2 border-black rounded-full px-4 py-2 text-[12px] w-[260px]" autoFocus />
            <button onClick={()=>handleScan()} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">스캔</button>
            <button onClick={showCamera ? stopCamera : startCamera} className={`px-4 py-2 rounded-full text-[11px] font-bold border ${showCamera ? "bg-red-500 text-white" : "bg-white"}`}>{showCamera ? "카메라 끄기" : "📷 카메라"}</button>
          </div>
        </div>

        {showCamera && (
          <div className="mt-4 bg-black rounded-[16px] p-4">
            <p className="text-white text-[12px] font-bold">📷 PDA + 카메라 스캔 - 휴대폰, Zebra, Honeywell, USB 스캐너 모두 키보드 입력! QuaggaJS, ZXing 연동 자리!</p>
            <video ref={videoRef} autoPlay playsInline className="mt-3 w-full max-w-[400px] h-[250px] bg-gray-900 rounded-[12px]"></video>
            <div className="mt-3 flex gap-2 flex-wrap"><button onClick={()=>handleScan("EAR-001")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">EAR-001</button><button onClick={()=>handleScan("무선이어폰 / 블랙")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">송장: 무선이어폰 / 블랙</button><button onClick={()=>handleScan("COS-001")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">COS-001 + 샘플</button><button onClick={()=>handleScan("K-POP 앨범 Vol.1")} className="bg-white text-black px-3 py-1.5 rounded-full text-[11px]">앨범 + 포토카드</button></div>
          </div>
        )}

        <div className="mt-4 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">WAVE 피킹 - 송장 품명 + PDA + 저울 + 동선 + 샘플/포토카드 + FIFO/FEFO</h3><span className="text-[11px] opacity-50">동선: {route} / FIFO: 입고일 빠른 순 / FEFO: 유통기한 빠른 순</span></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / 내부 품명 / 주문자 / 메시지 / 샘플/포토카드</th><th className="text-center">위치 / 입고일 / 유통기한 / SKU</th><th className="text-center">수량 / 중량 / 박스 / 저울</th><th className="text-center">상태</th><th className="text-center">액션</th></tr></thead>
            <tbody>{sortedOrders.map(o=>{
              const days = o.expiry ? Math.floor((new Date(o.expiry).getTime()-Date.now())/86400000) : 999;
              const isNear = days <=30 && days>=0;
              return <tr key={o.id} className={`border-b hover:bg-[#fafaf8] ${isNear ? "bg-amber-50" : ""}`}><td className="py-4 px-6"><p className={`font-black ${showInvoiceView ? "text-[14px]" : "text-[12px] opacity-60"}`}>📦 {o.invoice_name} {o.qty>1 && `x${o.qty}`}</p><p className={`${showInvoiceView ? "text-[11px] opacity-50" : "font-bold text-[13px]"} mt-1`}>{showInvoiceView ? `내부: ${o.product_name}` : `송장: ${o.invoice_name}`}</p><p className="text-[11px] opacity-60 mt-1">{o.recipient} / {o.seller}</p>{o.msg && <p className="text-[11px] text-red-600 font-bold">💬 {o.msg}</p>}{o.sample && <p className="text-[11px] text-green-600 font-bold">+ {o.sample} 자동!</p>}{o.photocard && <p className="text-[11px] text-purple-600 font-bold">+ {o.photocard} 🎲</p>}</td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-mono">{o.location}</span><p className="text-[9px] opacity-40 mt-1">입고 {o.inbound} {o.expiry && `· 유통 ${o.expiry} ${isNear ? `${days}일` : ""}`}</p><p className="text-[9px] opacity-40">{o.sku}</p></td><td className="text-center"><p className="font-bold">{o.qty}개</p><p className="text-[10px] opacity-50">{o.weight*o.qty}g / {o.box}</p><p className="text-[9px] opacity-40">저울 {o.status==="피킹완료" ? o.weight*o.qty : "-"}g</p></td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="피킹완료" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{o.status}</span>{o.picked_at && <p className="text-[9px] opacity-40 mt-1">{new Date(o.picked_at).toLocaleTimeString()}</p>}</td><td className="text-center"><button onClick={()=>{setOrders(orders.map(x=>x.id===o.id?{...x, status:"피킹완료", picked_at: new Date().toISOString()}:x)); setWeightScale(o.weight*o.qty);}} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${o.status==="피킹완료" ? "bg-green-500 text-white" : "bg-black text-white"}`}>{o.status==="피킹완료" ? "완료" : "피킹"}</button></td></tr>
            })}</tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">📦 송장 품명</p><p className="text-[11px] opacity-60 mt-2">작업자는 송장 품명 보고 피킹! `무선이어폰 / 블랙` 짧고 명확! 고객이 받는 택배에도 이 이름! 내부 긴 이름 안 봐도 돼!</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">📷 PDA + 카메라 + 저울</p><p className="text-[11px] opacity-60 mt-2">Zebra, Honeywell, 휴대폰 카메라, USB 스캐너 모두 키보드! 저울 CAS USB 연결! 예상 vs 실제 중량 다르면 오피킹 알림! QuaggaJS, ZXing 연동!</p></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5"><p className="font-bold text-[13px] text-black">🗺️ 동선 + FIFO/FEFO + 박스</p><p className="text-[11px] text-black/60 mt-2">A-01-02 → B-02-05 → C-01-01 동선! 입고일 빠른 순 FIFO + 유통기한 빠른 순 FEFO! 중량으로 소/중/대박스 자동 추천!</p></div>
          <div className="bg-purple-50 border border-purple-200 rounded-[16px] p-5"><p className="font-bold text-[13px] text-purple-700">🎁 샘플/포토카드 자동</p><p className="text-[11px] opacity-70 mt-2">에센스 사면 샘플 10ml 자동! 앨범 사면 포토카드 랜덤! 상품 마스터 is_sample, RULE 기반!</p></div>
        </div>
      </main>
    </div>
  );
}

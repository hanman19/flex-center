"use client";
import TopNav from "@/components/TopNav";
import { useState, useRef } from "react";

export default function AdminWMSProProTotalPickingPage() {
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", sku: "EAR-001", product_name: "무선 이어폰 Pro", invoice_name: "무선이어폰 / 블랙", qty: 2, location: "A-01-02", status: "피킹대기", wave: "WAVE-1", seller: "브랜드A", weight: 300, recipient: "김*수", expiry: "2025-10-20", inbound: "2024-10-20" },
    { id: "2", order_no: "20241027-002", sku: "EAR-001", product_name: "무선 이어폰 Pro", invoice_name: "무선이어폰 / 블랙", qty: 1, location: "A-01-02", status: "피킹대기", wave: "WAVE-1", seller: "브랜드B", weight: 300, recipient: "이*영", expiry: "2025-10-20", inbound: "2024-10-20" },
    { id: "3", order_no: "20241027-003", sku: "COS-001", product_name: "에센스 100ml", invoice_name: "수분에센스 100ml", qty: 1, location: "A-02-01", status: "피킹대기", wave: "WAVE-1", seller: "브랜드C", weight: 120, recipient: "박*진", expiry: "2024-11-15", inbound: "2024-09-01", sample: "SAMPLE-01" },
    { id: "4", order_no: "20241027-004", sku: "COS-001", product_name: "에센스 100ml", invoice_name: "수분에센스 100ml", qty: 2, location: "A-02-01", status: "피킹대기", wave: "WAVE-1", seller: "브랜드D", weight: 120, recipient: "최*아", expiry: "2024-11-15", inbound: "2024-09-01" },
    { id: "5", order_no: "20241027-005", sku: "ALBUM-01", product_name: "K-POP 앨범 Vol.1", invoice_name: "K-POP 앨범 Vol.1", qty: 1, location: "C-01-01", status: "피킹대기", wave: "WAVE-1", seller: "브랜드E", weight: 200, recipient: "정*훈", expiry: null, inbound: "2024-10-25", photocard: "포토카드 랜덤" },
  ]);
  const [mode, setMode] = useState<"order" | "total">("total"); // 오더 피킹 vs 토탈 피킹
  const [scanned, setScanned] = useState(""); const [showCamera, setShowCamera] = useState(false); const [weightScale, setWeightScale] = useState(0); const [showInvoiceView, setShowInvoiceView] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 토탈 피킹 집계 - 같은 SKU, 같은 위치끼리 합치기! 송장 품명 기준!
  const totalPickingList = orders.filter(o=>o.status==="피킹대기").reduce((acc:any, o:any)=>{
    const key = `${o.sku}-${o.location}`;
    if (!acc[key]) acc[key] = { sku: o.sku, product_name: o.product_name, invoice_name: o.invoice_name, location: o.location, total_qty: 0, orders: [], weight: o.weight, expiry: o.expiry, inbound: o.inbound, sample: o.sample, photocard: o.photocard };
    acc[key].total_qty += o.qty;
    acc[key].orders.push(o);
    return acc;
  }, {});
  const totalList = Object.values(totalPickingList).sort((a:any,b:any)=>a.location.localeCompare(b.location));

  const handleScan = (code?: string) => {
    const target = code || scanned;
    const found = orders.find(o=>o.sku===target || o.invoice_name===target);
    if (found) {
      if (mode==="total") {
        // 토탈 피킹: 같은 SKU 전체 피킹 완료!
        const sameSku = orders.filter(o=>o.sku===found.sku && o.status==="피킹대기");
        setOrders(orders.map(o=> sameSku.find((s:any)=>s.id===o.id) ? { ...o, status:"피킹완료" } : o));
        setWeightScale(found.weight * sameSku.reduce((s:any,o:any)=>s+o.qty,0));
        alert(`[토탈 피킹] ${found.invoice_name} 총 ${sameSku.reduce((s:any,o:any)=>s+o.qty,0)}개 피킹 완료! ${sameSku.length}개 주문 한번에! 위치 ${found.location} 1번만 방문!`);
      } else {
        setOrders(orders.map(o=>o.id===found.id?{...o, status:"피킹완료"}:o));
        alert(`[오더 피킹] ${found.invoice_name} 피킹 완료!`);
      }
      setScanned("");
    }
  };

  const sortedOrders = [...orders].sort((a,b)=>a.location.localeCompare(b.location));

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">WMS Pro Pro - 토탈 피킹 + 오더 피킹</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">토탈 피킹 + 송장 품명 + PDA + 저울</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">토탈 피킹 = 같은 SKU 합쳐서 한번에! 오더 피킹 = 주문 1건씩! 500건이면 토탈 피킹이 50% 빠름!</p>

        <div className="mt-4 flex gap-2 items-center">
          <button onClick={()=>setMode("total")} className={`px-5 py-2.5 rounded-full text-[12px] font-black border-2 ${mode==="total" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>📦 토탈 피킹 (합계) - 추천!</button>
          <button onClick={()=>setMode("order")} className={`px-5 py-2.5 rounded-full text-[12px] font-black border-2 ${mode==="order" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>📋 오더 피킹 (주문별)</button>
          <div className="ml-4 flex gap-2"><button onClick={()=>setShowInvoiceView(true)} className={`px-3 py-2 rounded-full text-[11px] font-bold border ${showInvoiceView ? "bg-black text-white" : "bg-white"}`}>📦 송장 품명</button><button onClick={()=>setShowInvoiceView(false)} className={`px-3 py-2 rounded-full text-[11px] font-bold border ${!showInvoiceView ? "bg-black text-white" : "bg-white"}`}>내부 품명</button></div>
          <div className="ml-auto flex gap-2 items-center"><span className="text-[11px] opacity-50">저울 {weightScale}g</span><input value={scanned} onChange={e=>setScanned(e.target.value)} onKeyDown={e=>e.key==="Enter" && handleScan()} placeholder="송장 품명, SKU 스캔" className="border-2 border-black rounded-full px-4 py-2 text-[12px] w-[200px]" /><button onClick={()=>handleScan()} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">스캔</button></div>
        </div>

        {mode==="total" ? (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b bg-[#FFC61A]/20 flex items-center justify-between"><h3 className="font-black">📦 토탈 피킹 리스트 - 같은 SKU 합쳐서! 송장 품명 기준! 동선 A→B→C + FIFO!</h3><span className="text-[11px] font-bold">총 {totalList.length}개 SKU / {orders.filter(o=>o.status==="피킹대기").reduce((s,o)=>s+o.qty,0)}개 상품 / {orders.filter(o=>o.status==="피킹대기").length}개 주문을 {totalList.length}번 방문으로!</span></div>
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / 내부 품명 / 위치 / 유통기한 / 샘플/포토카드</th><th className="text-center">합계 수량</th><th className="text-center">주문 수</th><th className="text-center">중량 / 박스 / 저울</th><th className="text-center">액션</th></tr></thead>
              <tbody>{totalList.map((t:any)=><tr key={t.sku} className="border-b hover:bg-[#fafaf8]"><td className="py-4 px-6"><p className="font-black text-[14px]">📦 {t.invoice_name} {showInvoiceView ? "" : `(${t.product_name})`}</p><p className="text-[11px] opacity-50 mt-1">{showInvoiceView ? `내부: ${t.product_name}` : `송장: ${t.invoice_name}`} / 위치 {t.location} / 입고 {t.inbound} {t.expiry && `· 유통 ${t.expiry}`}</p><p className="text-[10px] opacity-40 mt-1">주문: {t.orders.map((o:any)=>`${o.order_no}(${o.recipient} x${o.qty})`).join(", ")}</p>{t.sample && <p className="text-[11px] text-green-600 font-bold">+ {t.sample} x{t.total_qty} 자동!</p>}{t.photocard && <p className="text-[11px] text-purple-600 font-bold">+ {t.photocard} x{t.total_qty} 🎲</p>}</td><td className="text-center"><p className="font-black text-[18px]">{t.total_qty}개</p></td><td className="text-center"><p className="font-bold">{t.orders.length}건</p><p className="text-[10px] opacity-50">합포장 포함</p></td><td className="text-center"><p className="font-bold">{t.weight * t.total_qty}g</p><p className="text-[10px] opacity-50">{t.weight*t.total_qty<=500 ? "소박스" : t.weight*t.total_qty<=2000 ? "중박스" : "대박스"} / 저울 {weightScale}g</p></td><td className="text-center"><button onClick={()=>{setOrders(orders.map(o=> t.orders.find((x:any)=>x.id===o.id) ? { ...o, status:"피킹완료" } : o)); setWeightScale(t.weight*t.total_qty);}} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">토탈 피킹 {t.total_qty}개</button></td></tr>)}</tbody>
            </table>
            <div className="px-6 py-4 bg-black text-white flex items-center justify-between"><p className="text-[12px] font-bold">토탈 피킹 후 분배(Sorting) - 피킹한 {orders.filter(o=>o.status==="피킹완료").reduce((s,o)=>s+o.qty,0)}개를 주문별로 나눠 담기! DAS, 소터, 수동 분배대!</p><span className="text-[11px] opacity-60">피킹 1번 + 분배 1번 = 총 2번! 오더 피킹은 5번 방문!</span></div>
          </div>
        ) : (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">📋 오더 피킹 리스트 - 주문 1건씩! 송장 품명 + 위치 + 저울 + 샘플/포토카드</h3><span className="text-[11px] opacity-50">동선: {sortedOrders.map(o=>o.location).join(" → ")} / 같은 위치 2번 방문!</span></div>
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / 주문자 / 메시지</th><th className="text-center">위치 / SKU</th><th className="text-center">수량 / 중량</th><th className="text-center">상태</th><th className="text-center">액션</th></tr></thead>
              <tbody>{sortedOrders.map(o=><tr key={o.id} className="border-b"><td className="py-4 px-6"><p className="font-bold">📦 {o.invoice_name} x{o.qty}</p><p className="text-[11px] opacity-50">{o.product_name} / {o.recipient} {o.msg && `· 💬 ${o.msg}`}</p></td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px] font-mono">{o.location}</span></td><td className="text-center">{o.qty}개 / {o.weight*o.qty}g</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="피킹완료" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{o.status}</span></td><td className="text-center"><button onClick={()=>setOrders(orders.map(x=>x.id===o.id?{...x, status:"피킹완료"}:x))} className="bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-bold">피킹</button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">📦 토탈 피킹이란?</p><p className="text-[11px] opacity-60 mt-2">같은 SKU 합쳐서 한번에 피킹! 예: 이어폰 2개 주문 + 이어폰 1개 주문 → A-01-02에서 이어폰 3개 한번에! 동선 1번! 그 다음 분배대에서 주문별로 나눠 담기! 500건이면 시간 50% 절약!</p></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5"><p className="font-bold text-[13px] text-black">⚡ 언제 토탈 피킹?</p><p className="text-[11px] text-black/60 mt-2">같은 SKU가 많은 경우! 예: 화장품 100개 중 에센스 50개! 토탈 피킹으로 에센스 50개 한번에! 오더 피킹은 50번 방문! 토탈 피킹은 1번! 김포센터 1일 500건은 토탈 피킹 필수!</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">📋 언제 오더 피킹?</p><p className="text-[11px] opacity-60 mt-2">주문이 적거나, SKU가 다 다른 경우! 예: 10건인데 SKU 10개 다 다름! 오더 피킹이 편함! 합포장 주문은 오더 피킹으로 1박스에 담기!</p></div>
          <div className="bg-purple-50 border border-purple-200 rounded-[16px] p-5"><p className="font-bold text-[13px] text-purple-700">🎁 토탈 + 샘플/포토카드</p><p className="text-[11px] opacity-70 mt-2">토탈 피킹해도 샘플/포토카드 자동! 에센스 50개 피킹 → 샘플 10ml 50개 자동 추가! 분배할 때 같이 나눠 담기!</p></div>
        </div>
      </main>
    </div>
  );
}

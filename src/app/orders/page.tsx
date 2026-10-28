"use client";
import TopNav from "@/components/TopNav";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

// CJ 송장 API - 실제는 서버에서 호출! 지금은 목업이지만 구조는 진짜!
const generateCJInvoiceNo = () => {
  // 실제 CJ API: POST https://api.cjlogistics.com/invoice/create { ... } -> { invoice_no: "630012345678" }
  const rand = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `63${rand}`.slice(0, 12); // 12자리 CJ 송장 번호
};

export default function OrdersProPage() {
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", recipient: "김*수", phone: "010-1234-5678", address: "서울 강남구 테헤란로 123", sku: "EAR-001", product_name: "무선 이어폰 Pro ANC 노이즈캔슬링 블랙", invoice_name: "무선이어폰 / 블랙", qty: 2, price: 59000, status: "결제완료", seller: "브랜드A", msg: "문 앞에 놔주세요", platform: "스마트스토어", merged: false, group_id: "G-001", invoice_no: null, cs: null },
    { id: "2", order_no: "20241027-002", recipient: "김*수", phone: "010-1234-5678", address: "서울 강남구 테헤란로 123", sku: "WATCH-02", product_name: "스마트 워치 Series 8 45mm 실버", invoice_name: "스마트워치 S8 45mm", qty: 1, price: 350000, status: "결제완료", seller: "브랜드A", msg: "문 앞에 놔주세요", platform: "스마트스토어", merged: false, group_id: "G-001", invoice_no: null, cs: null },
    { id: "3", order_no: "20241027-003", recipient: "이*영", phone: "010-9876-5432", address: "경기 김포시 김포대로 100", sku: "COS-001", product_name: "에센스 100ml 히알루론산 수분", invoice_name: "수분에센스 100ml", qty: 1, price: 29000, status: "배송준비중", seller: "브랜드C", msg: "", platform: "쿠팡", merged: false, group_id: null, invoice_no: null, cs: null },
    { id: "4", order_no: "20241027-004", recipient: "최*아", phone: "010-1111-2222", address: "서울 마포구 홍대로 50", sku: "ALBUM-01", product_name: "K-POP 앨범 Vol.1 초판 한정판 포스터 포함", invoice_name: "K-POP 앨범 Vol.1", qty: 1, price: 25000, status: "피킹완료", seller: "브랜드D", msg: "포카 손상 주의!", platform: "쿠팡", merged: false, group_id: null, invoice_no: "630012345678", cs: null },
    { id: "5", order_no: "20241027-005", recipient: "박*진", phone: "010-3333-4444", address: "인천 서구 청라로 20", sku: "EAR-001", product_name: "무선 이어폰 Pro ANC 노이즈캔슬링 블랙", invoice_name: "무선이어폰 / 블랙", qty: 1, price: 59000, status: "CS요청", seller: "브랜드A", msg: "", platform: "스마트스토어", merged: false, group_id: null, invoice_no: "630098765432", cs: { type: "오배송", reason: "블랙 주문했는데 화이트 옴", photo: null, action: "재배송" } },
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const [csModal, setCsModal] = useState<any>(null);

  // 합포장 그룹 찾기 - 같은 수령인, 같은 주소, 같은 전화번호면 합포장 대상!
  const consolidationGroups = orders.reduce((acc:any, o)=>{
    if (o.invoice_no) return acc; // 송장 나온 건 제외
    const key = `${o.recipient}-${o.phone}-${o.address}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(o);
    return acc;
  }, {});

  const consolidatable = Object.entries(consolidationGroups).filter(([k,v]:any)=>v.length>1);

  const doConsolidate = (group: any[]) => {
    const groupId = `G-${Date.now()}`;
    const invoiceNames = group.map((o:any)=>`${o.invoice_name} x${o.qty}`).join(", ");
    const totalQty = group.reduce((s:any,o:any)=>s+o.qty,0);
    const totalPrice = group.reduce((s:any,o:any)=>s+o.price*o.qty,0);
    // 합포장: 송장 품명은 "무선이어폰 / 블랙 외 1건" 또는 전체 나열
    const mergedInvoiceName = group.length===2 ? `${group[0].invoice_name} 외 ${group.length-1}건` : `${group[0].invoice_name} 외 ${group.length-1}건`;
    setOrders(orders.map(o=> group.find((g:any)=>g.id===o.id) ? { ...o, merged: true, group_id: groupId, merged_invoice_name: mergedInvoiceName, merged_detail: invoiceNames, total_qty: totalQty, total_price: totalPrice, status: "합포장완료" } : o));
    alert(`합포장 완료! ${group[0].recipient}님 ${group.length}건 → 1박스! 송장 품명: ${mergedInvoiceName} / 상세: ${invoiceNames} / 배송비 1건 절약!`);
  };

  const issueInvoice = (orderIds: string[]) => {
    // 실제 CJ API 호출 자리 - 지금은 목업
    // const res = await fetch("/api/cj/invoice", { method: "POST", body: JSON.stringify({ orders: orderIds, invoice_product_name: ... }) })
    const invoiceNo = generateCJInvoiceNo();
    setOrders(orders.map(o=> orderIds.includes(o.id) ? { ...o, invoice_no: invoiceNo, status: "송장발행완료", tracking_url: `https://www.cjlogistics.com/ko/tool/parcel/tracking?inv=${invoiceNo}` } : o));
    alert(`CJ 송장 발행 완료! 송장 번호: ${invoiceNo}\n실제 API 연동시: CJ 서버에 ${orderIds.length}건 송장 등록 + 고객에게 카톡 알림!`);
  };

  const handleCS = (order: any, action: string) => {
    if (action==="재배송") {
      setOrders(orders.map(o=> o.id===order.id ? { ...o, status: "재배송준비", cs: { ...o.cs, action: "재배송" } } : o));
      alert(`${order.order_no} 재배송 처리! 송장 품명 ${order.invoice_name}으로 재배송 송장 발행!`);
    }
    if (action==="환불") {
      setOrders(orders.map(o=> o.id===order.id ? { ...o, status: "환불완료", cs: { ...o.cs, action: "환불" } } : o));
    }
    setCsModal(null);
  };

  const pendingOrders = orders.filter(o=>!o.invoice_no);
  const shippedOrders = orders.filter(o=>o.invoice_no);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">주문 Pro - 합포장 + CS + CJ 송장</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">합포장 + 송장 품명 + CJ API</span><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">Pro</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">같은 사람 주문 자동 합포장! 송장 품명으로 합포장! CS 교환/반품! 진짜 CJ 송장 API 연동 자리!</p>

        {consolidatable.length>0 && (
          <div className="mt-6 bg-[#FFC61A] border-2 border-black rounded-[16px] p-5">
            <h3 className="font-black text-[14px] text-black">🎁 합포장 대상 발견! {consolidatable.length}그룹 / {consolidatable.reduce((s:any,[k,v]:any)=>s+v.length,0)}건 - 배송비 절약!</h3>
            <p className="text-[11px] text-black/60 mt-1">같은 수령인, 같은 주소, 같은 전화번호면 합포장! 송장 품명은 `무선이어폰 외 1건`으로!</p>
            <div className="mt-3 space-y-2">
              {consolidatable.map(([key, group]:any)=><div key={key} className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-black/10">
                <div><p className="font-bold text-[13px]">{group[0].recipient} / {group[0].phone} / {group[0].address}</p><p className="text-[11px] opacity-60 mt-1">{group.map((o:any)=>`${o.invoice_name} x${o.qty} (${o.order_no})`).join(", ")} → 총 {group.reduce((s:any,o:any)=>s+o.qty,0)}개</p><p className="text-[11px] font-bold mt-1">합포장 송장 품명: {group[0].invoice_name} 외 {group.length-1}건 / 상세: {group.map((o:any)=>o.invoice_name).join(", ")}</p></div>
                <button onClick={()=>doConsolidate(group)} className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-black">합포장 하기 - 배송비 절약!</button>
              </div>)}
            </div>
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-4 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-4"><p className="text-[11px] opacity-40">결제완료</p><p className="text-[20px] font-black mt-1">{orders.filter(o=>o.status==="결제완료").length}건</p></div>
          <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">합포장완료</p><p className="text-[20px] font-black mt-1 text-amber-700">{orders.filter(o=>o.status==="합포장완료").length}건</p></div>
          <div className="bg-blue-50 border border-blue-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">송장발행완료</p><p className="text-[20px] font-black mt-1 text-blue-700">{shippedOrders.length}건</p></div>
          <div className="bg-red-50 border border-red-200 rounded-[16px] p-4"><p className="text-[11px] opacity-60">CS요청</p><p className="text-[20px] font-black mt-1 text-red-700">{orders.filter(o=>o.status==="CS요청" || o.cs).length}건</p></div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">출고 전 주문 - 합포장 + 송장 품명 + CJ 송장 발행</h3><div className="flex gap-2"><button onClick={()=>issueInvoice(selected.length?selected:pendingOrders.map(o=>o.id))} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">선택 {selected.length||pendingOrders.length}건 CJ 송장 발행</button></div></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-center py-3"><input type="checkbox" onChange={e=>setSelected(e.target.checked ? pendingOrders.map(o=>o.id) : [])} /></th><th className="text-left py-3 px-4">송장 품명 / 합포장 / 주문자 / 플랫폼</th><th className="text-center">수량 / 금액</th><th className="text-center">상태</th><th className="text-center">CS</th><th className="text-center">액션</th></tr></thead>
            <tbody>{pendingOrders.map(o=><tr key={o.id} className={`border-b hover:bg-[#fafaf8] ${o.merged ? "bg-amber-50" : ""}`}><td className="text-center"><input type="checkbox" checked={selected.includes(o.id)} onChange={e=>setSelected(e.target.checked ? [...selected, o.id] : selected.filter(id=>id!==o.id))} /></td><td className="py-4 px-4"><p className="font-black text-[13px]">📦 {o.merged ? o.merged_invoice_name : `${o.invoice_name} x${o.qty}`}</p><p className="text-[11px] opacity-50 mt-1">{o.merged ? `상세: ${o.merged_detail}` : `내부: ${o.product_name}`} {o.merged && "· 합포장!"}</p><p className="text-[11px] opacity-60 mt-1">{o.recipient} / {o.phone} / {o.address}</p><p className="text-[10px] opacity-40">{o.platform} · {o.order_no} · {o.seller} {o.msg && `· 💬 ${o.msg}`}</p></td><td className="text-center"><p className="font-bold">{o.total_qty||o.qty}개</p><p className="text-[11px] opacity-60">{(o.total_price||o.price*o.qty).toLocaleString()}원</p></td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="합포장완료" ? "bg-amber-200 text-amber-800" : "bg-gray-100"}`}>{o.status}</span></td><td className="text-center">{o.cs ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold">{o.cs.type}</span> : "-"}</td><td className="text-center flex gap-1 justify-center"><button onClick={()=>issueInvoice([o.id])} className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold">CJ 송장</button><button onClick={()=>setCsModal(o)} className="bg-white border border-black/10 px-3 py-1.5 rounded-full text-[10px] font-bold">CS</button></td></tr>)}</tbody>
          </table>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b"><h3 className="font-bold">송장 발행 완료 - CJ 추적</h3></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / 주문번호 / CJ 송장 번호</th><th className="text-center">수령인</th><th className="text-center">추적</th><th className="text-center">상태</th></tr></thead>
            <tbody>{shippedOrders.map(o=><tr key={o.id} className="border-b"><td className="py-4 px-6"><p className="font-bold">📦 {o.merged_invoice_name || `${o.invoice_name} x${o.qty}`}</p><p className="text-[11px] opacity-50">{o.order_no} · CJ {o.invoice_no}</p></td><td className="text-center">{o.recipient}</td><td className="text-center"><a href={o.tracking_url} target="_blank" className="text-blue-600 underline text-[11px]">{o.invoice_no}</a></td><td className="text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold">{o.status}</span></td></tr>)}</tbody>
          </table>
        </div>

        {csModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-[16px] p-6 max-w-[500px] w-full mx-4">
            <h3 className="font-black text-[16px]">CS 처리 - {csModal.order_no}</h3><p className="text-[13px] mt-2">송장 품명: {csModal.invoice_name} / 내부: {csModal.product_name}</p><p className="text-[13px] mt-1">주문자: {csModal.recipient} / 사유: {csModal.cs?.reason || "오배송"}</p><p className="text-[11px] opacity-60 mt-2">* 사진 업로드 자리 - 고객이 찍은 사진! 교환이면 재배송 송장 발행, 반품이면 환불!</p>
            <div className="mt-4 flex gap-2"><button onClick={()=>handleCS(csModal, "재배송")} className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold flex-1">재배송 - CJ 송장 재발행 (송장 품명: {csModal.invoice_name})</button><button onClick={()=>handleCS(csModal, "환불")} className="bg-white border border-black/10 px-5 py-2.5 rounded-full text-[12px] font-bold flex-1">환불</button><button onClick={()=>setCsModal(null)} className="bg-gray-100 px-5 py-2.5 rounded-full text-[12px] font-bold">닫기</button></div>
          </div></div>
        )}

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">🎁 합포장 로직</p><p className="text-[11px] opacity-60 mt-2">같은 수령인 + 같은 주소 + 같은 전화번호면 자동 합포장 대상! 송장 품명은 `무선이어폰 / 블랙 외 1건`으로! 배송비 1건 절약! 고객은 1박스로 받음! WMS에서는 합포장된 박스 1개만 피킹!</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">📦 CJ 송장 API</p><p className="text-[11px] opacity-60 mt-2">실제 CJ API: POST https://api.cjlogistics.com/v1/invoice { customer, product: invoice_name, qty } → { invoice_no: 6300... } / 서버에서 호출! 지금은 목업 6300... 생성! 추적 URL https://cjlogistics.com/tracking?inv=번호!</p></div>
          <div className="bg-red-50 border border-red-200 rounded-[16px] p-5"><p className="font-bold text-[13px] text-red-700">🛠️ CS 처리</p><p className="text-[11px] opacity-70 mt-2">오배송, 파손, 누락! 사유 + 사진 업로드! 재배송이면 송장 품명으로 CJ 송장 재발행! 환불이면 환불 처리! CS 때문에 합포장 풀리면 다시 분리!</p></div>
        </div>
      </main>
    </div>
  );
}

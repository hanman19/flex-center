"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

const generateCJInvoiceNo = () => {
  const rand = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `63${rand}`.slice(0, 12);
};

export default function OrdersProPageFixed() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([
    { id: "1", order_no: "20241027-001", recipient: "김*수", phone: "010-1234-5678", address: "서울 강남구 테헤란로 123", sku: "EAR-001", product_name: "무선 이어폰 Pro ANC 노이즈캔슬링 블랙", invoice_name: "무선이어폰 / 블랙", qty: 2, price: 59000, status: "결제완료", seller: "브랜드A", msg: "문 앞에 놔주세요", platform: "스마트스토어", merged: false, group_id: "G-001", invoice_no: null, cs: null },
    { id: "2", order_no: "20241027-002", recipient: "김*수", phone: "010-1234-5678", address: "서울 강남구 테헤란로 123", sku: "WATCH-02", product_name: "스마트 워치 Series 8 45mm 실버", invoice_name: "스마트워치 S8 45mm", qty: 1, price: 350000, status: "결제완료", seller: "브랜드A", msg: "문 앞에 놔주세요", platform: "스마트스토어", merged: false, group_id: "G-001", invoice_no: null, cs: null },
    { id: "3", order_no: "20241027-003", recipient: "이*영", phone: "010-9876-5432", address: "경기 김포시 김포대로 100", sku: "COS-001", product_name: "에센스 100ml 히알루론산 수분", invoice_name: "수분에센스 100ml", qty: 1, price: 29000, status: "배송준비중", seller: "브랜드C", msg: "", platform: "쿠팡", merged: false, group_id: null, invoice_no: null, cs: null },
    { id: "4", order_no: "20241027-004", recipient: "최*아", phone: "010-1111-2222", address: "서울 마포구 홍대로 50", sku: "ALBUM-01", product_name: "K-POP 앨범 Vol.1 초판 한정판 포스터 포함", invoice_name: "K-POP 앨범 Vol.1", qty: 1, price: 25000, status: "피킹완료", seller: "브랜드D", msg: "포카 손상 주의!", platform: "쿠팡", merged: false, group_id: null, invoice_no: "630012345678", cs: null },
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const [csModal, setCsModal] = useState<any>(null);

  useEffect(()=>{ setMounted(true); }, []);

  const consolidationGroups = orders.reduce((acc:any, o)=>{
    if (o.invoice_no) return acc;
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
    const mergedInvoiceName = `${group[0].invoice_name} 외 ${group.length-1}건`;
    setOrders(orders.map(o=> group.find((g:any)=>g.id===o.id) ? { ...o, merged: true, group_id: groupId, merged_invoice_name: mergedInvoiceName, merged_detail: invoiceNames, total_qty: totalQty, total_price: totalPrice, status: "합포장완료" } : o));
  };

  const issueInvoice = (orderIds: string[]) => {
    const invoiceNo = generateCJInvoiceNo();
    setOrders(orders.map(o=> orderIds.includes(o.id) ? { ...o, invoice_no: invoiceNo, status: "송장발행완료", tracking_url: `https://www.cjlogistics.com/ko/tool/parcel/tracking?inv=${invoiceNo}` } : o));
  };

  const pendingOrders = orders.filter(o=>!o.invoice_no);
  const shippedOrders = orders.filter(o=>o.invoice_no);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">주문 Pro - 합포장 + CS + CJ 송장</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">합포장 + 송장 품명 + CJ API</span></div></div>

        {consolidatable.length>0 && (
          <div className="mt-6 bg-[#FFC61A] border-2 border-black rounded-[16px] p-5">
            <h3 className="font-black text-[14px] text-black">합포장 대상 발견! {consolidatable.length}그룹</h3>
            <div className="mt-3 space-y-2">
              {consolidatable.map(([key, group]:any)=><div key={key} className="bg-white rounded-[12px] p-4 flex items-center justify-between border border-black/10">
                <div><p className="font-bold text-[13px]">{group[0].recipient} / {group[0].phone}</p><p className="text-[11px] opacity-60 mt-1">{group.map((o:any)=>`${o.invoice_name} x${o.qty}`).join(", ")} → 총 {group.reduce((s:any,o:any)=>s+o.qty,0)}개</p></div>
                <button onClick={()=>doConsolidate(group)} className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-black">합포장 하기</button>
              </div>)}
            </div>
          </div>
        )}

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold">출고 전 주문</h3><button onClick={()=>issueInvoice(selected.length?selected:pendingOrders.map(o=>o.id))} className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold">선택 {selected.length||pendingOrders.length}건 CJ 송장 발행</button></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-center py-3"><input type="checkbox" onChange={e=>setSelected(e.target.checked ? pendingOrders.map(o=>o.id) : [])} /></th><th className="text-left py-3 px-4">송장 품명 / 주문자</th><th className="text-center">수량 / 금액</th><th className="text-center">상태</th><th className="text-center">액션</th></tr></thead>
            <tbody>{pendingOrders.map(o=><tr key={o.id} className={`border-b hover:bg-[#fafaf8] ${o.merged ? "bg-amber-50" : ""}`}><td className="text-center"><input type="checkbox" checked={selected.includes(o.id)} onChange={e=>setSelected(e.target.checked ? [...selected, o.id] : selected.filter(id=>id!==o.id))} /></td><td className="py-4 px-4"><p className="font-black text-[13px]">{o.merged ? o.merged_invoice_name : `${o.invoice_name} x${o.qty}`}</p><p className="text-[11px] opacity-60 mt-1">{o.recipient} / {o.phone}</p></td><td className="text-center"><p className="font-bold">{o.total_qty||o.qty}개</p><p className="text-[11px] opacity-60">{(o.total_price||o.price*o.qty).toLocaleString()}원</p></td><td className="text-center"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100">{o.status}</span></td><td className="text-center"><button onClick={()=>issueInvoice([o.id])} className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold">CJ 송장</button></td></tr>)}</tbody>
          </table>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b"><h3 className="font-bold">송장 발행 완료</h3></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">송장 품명 / CJ 송장 번호</th><th className="text-center">수령인</th><th className="text-center">추적</th></tr></thead>
            <tbody>{shippedOrders.map(o=><tr key={o.id} className="border-b"><td className="py-4 px-6"><p className="font-bold">{o.merged_invoice_name || `${o.invoice_name} x${o.qty}`}</p><p className="text-[11px] opacity-50">CJ {o.invoice_no}</p></td><td className="text-center">{o.recipient}</td><td className="text-center"><a href={o.tracking_url} target="_blank" className="text-blue-600 underline text-[11px]">{o.invoice_no}</a></td></tr>)}</tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">합포장 로직</p><p className="text-[11px] opacity-60 mt-2">같은 수령인 + 같은 주소 + 같은 전화번호면 자동 합포장 대상! 송장 품명은 외 1건으로! 배송비 1건 절약!</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold text-[13px]">CJ 송장 API</p><p className="text-[11px] opacity-60 mt-2">실제 CJ API는 서버에서 호출! POST api.cjlogistics.com/v1/invoice - Body에 customer, product invoice_name, qty - Response invoice_no 6300! 지금은 목업 생성!</p></div>
          <div className="bg-red-50 border border-red-200 rounded-[16px] p-5"><p className="font-bold text-[13px] text-red-700">CS 처리</p><p className="text-[11px] opacity-70 mt-2">오배송, 파손, 누락! 재배송이면 송장 품명으로 CJ 송장 재발행!</p></div>
        </div>
      </main>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

const PLANS: any = {
  STARTER: { name: "STARTER", quota: 10, price: 26900, over: 1600, range: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개" },
  LITE: { name: "LITE", quota: 100, price: 149000, over: 1400, range: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", popular: true },
  STANDARD: { name: "STANDARD", quota: 500, price: 599000, over: 1200, range: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개" },
  GOLD: { name: "GOLD", quota: 1000, price: 1190000, over: 1150, range: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개" },
  PLATINUM: { name: "PLATINUM", quota: 3000, price: 3290000, over: 1100, range: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개" },
  VIP: { name: "VIP", quota: 5000, price: 5349000, over: 1050, range: "5001건~", switchText: "대량 협의", storage: "파렛트 40개" },
};

export default function OrdersPage() {
  const [planId, setPlanId] = useState("STARTER");
  const [used, setUsed] = useState(9);
  const [orders, setOrders] = useState<any[]>([
    { id: "11", order_no: "20241027-011", recipient: "정하은", product: "에센스 100ml", qty: 1, invoice: "", status: "패킹완료" },
    { id: "12", order_no: "C-012", recipient: "한지우", product: "스마트 워치", qty: 1, invoice: "", status: "피킹중" },
    { id: "13", order_no: "20241027-013", recipient: "김민수", product: "무선 이어폰", qty: 2, invoice: "CJ123456", status: "출고완료" },
  ]);
  const [showUpgrade, setShowUpgrade] = useState<any>(null);
  const plan = PLANS[planId];

  const issueInvoice = (o: any) => {
    if (used >= plan.quota) { setShowUpgrade(o); return; }
    const inv = "CJ" + Math.floor(Math.random()*1000000000);
    setOrders(orders.map(x=>x.id===o.id?{...x, invoice:inv, status:"출고완료"}:x));
    setUsed(used+1);
  };

  const payOverage = () => {
    const inv = "CJ" + Math.floor(Math.random()*1000000000);
    setOrders(orders.map(x=>x.id===showUpgrade.id?{...x, invoice:inv, status:"출고완료"}:x));
    setUsed(used+1);
    setShowUpgrade(null);
    alert(`${plan.over}원 초과 결제 완료! Toss Metered Billing로 다음달 청구됩니다.`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[28px] font-black">주문관리</h1><select value={planId} onChange={e=>setPlanId(e.target.value)} className="border border-black/10 rounded-full px-3 py-1.5 text-[11px]"><option value="STARTER">STARTER 10건</option><option value="LITE">LITE 100건</option><option value="STANDARD">STANDARD 500건</option><option value="GOLD">GOLD 1000건</option></select></div>
        <p className="text-[13px] opacity-60 mt-1">피킹 → 패킹 → 송장 → 플랫폼 업로드까지</p>

        <div className={`mt-6 rounded-[16px] p-5 border-2 ${used >= plan.quota ? "bg-red-50 border-red-500" : used >= plan.quota*0.8 ? "bg-amber-50 border-amber-500" : "bg-white border-black/5"}`}>
          <div className="flex items-center justify-between"><div><p className="text-[11px] opacity-60">{plan.name} {plan.quota}건 / {plan.storage}</p><p className="text-[28px] font-black mt-1">{used} / {plan.quota}건</p><div className="mt-2 h-2 w-[300px] bg-black/10 rounded-full overflow-hidden"><div className={`h-full ${used >= plan.quota ? "bg-red-500" : used >= plan.quota*0.8 ? "bg-amber-500" : "bg-black"}`} style={{width: `${Math.min(100, (used/plan.quota)*100)}%`}}></div></div></div><div className="text-right"><p className="text-[10px] opacity-40">초과 건당</p><p className="font-bold text-[14px]">{plan.over}원</p><p className="text-[10px] opacity-40">{plan.range}</p><p className="text-[10px] opacity-60 mt-1">{plan.switchText}</p></div></div>
          {used >= plan.quota && <p className="text-[11px] text-red-600 font-bold mt-3">⚠️ 월 {plan.quota}건 초과! 초과분은 건당 {plan.over}원 청구됩니다.</p>}
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">주문 / 수취인</th><th className="text-center">상품 / 수량</th><th className="text-center">송장</th><th className="text-center">상태</th><th className="text-center">액션</th></tr></thead>
            <tbody>{orders.map(o=>{
              const blocked = used >= plan.quota && !o.invoice;
              return <tr key={o.id} className={`border-b ${blocked ? "bg-red-50" : "hover:bg-[#fafaf8]"}`}><td className="py-4 px-6"><p className="font-mono text-[11px]">{o.order_no}</p><p className="text-[11px] opacity-60">{o.recipient}</p></td><td className="text-center">{o.product} x{o.qty}</td><td className="text-center font-mono text-[11px]">{o.invoice || "미발급"}</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="출고완료" ? "bg-green-100 text-green-700" : blocked ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{blocked ? `초과 ${plan.over}원` : o.status}</span></td><td className="text-center">{o.invoice ? <span className="text-[11px] opacity-50">완료</span> : blocked ? <button onClick={()=>setShowUpgrade(o)} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[11px] font-bold">초과 {plan.over}원</button> : <button onClick={()=>issueInvoice(o)} className="bg-black text-white px-3 py-1.5 rounded-full text-[11px] font-bold">송장 발급</button>}</td></tr>
            })}</tbody>
          </table>
        </div>

        {showUpgrade && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[20px] p-6 max-w-[400px] w-full"><h3 className="font-black">월 {plan.quota}건 초과!</h3><p className="text-[12px] opacity-60 mt-2">{plan.name} 초과 건당 {plan.over}원 ({plan.range})</p><p className="text-[11px] opacity-50 mt-1">{plan.switchText}</p><p className="text-[11px] opacity-40 mt-2">Toss Payments Metered Billing로 다음달에 청구됩니다.</p><button onClick={payOverage} className="mt-4 w-full bg-blue-600 text-white py-3 rounded-full font-bold">{plan.over}원 결제하고 출고 →</button><button onClick={()=>setShowUpgrade(null)} className="mt-2 w-full border border-black/10 py-3 rounded-full text-[12px]">닫기</button></div>
          </div>
        )}

        <div className="mt-6 bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[13px]">💡 합포장, 샘플 자동추가, 포토카드 랜덤은?</p><p className="text-[11px] opacity-60 mt-2">상품 마스터에서 샘플 여부 체크, 앨범 상품은 포토카드 랜덤 로직. 주문 2개 이상 동일 수취인이면 합포장 자동 제안. Phase 2에서 구현!</p></div>
      </main>
    </div>
  );
}

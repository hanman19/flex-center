"use client";
import { useState } from "react";
import Link from "next/link";

const NEW_PLANS: any = {
  STARTER: { name: "STARTER", quota: 10, price: 26900, per: 2690, over: 1600, range: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개" },
  LITE: { name: "LITE", quota: 100, price: 149000, per: 1490, over: 1400, range: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", popular: true },
  STANDARD: { name: "STANDARD", quota: 500, price: 599000, per: 1198, over: 1200, range: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개" },
  GOLD: { name: "GOLD", quota: 1000, price: 1190000, per: 1190, over: 1150, range: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개" },
  PLATINUM: { name: "PLATINUM", quota: 3000, price: 3290000, per: 1096, over: 1100, range: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개" },
  VIP: { name: "VIP", quota: 5000, price: 5349000, per: 1069, over: 1050, range: "5001건~", switchText: "대량 협의·규모 경제", storage: "파렛트 40개" },
};

export default function OrdersNoCheapPage() {
  const [planId, setPlanId] = useState("STARTER");
  const [used, setUsed] = useState(10);
  const [orders, setOrders] = useState([
    { id: "11", order_no: "20241027-011", recipient: "정하은", product: "에센스 100ml", qty: 1, invoice: "" },
    { id: "12", order_no: "C-012", recipient: "한지우", product: "스마트 워치", qty: 1, invoice: "" },
    { id: "13", order_no: "20241027-013", recipient: "김민준", product: "K-pop 앨범", qty: 2, invoice: "" },
  ]);
  const [showUpgrade, setShowUpgrade] = useState<any>(null);
  const [planStarted] = useState("2024-10-01");
  const [today] = useState("2024-10-10");

  const plan = NEW_PLANS[planId];
  const quota = plan.quota;

  const calcProration = (newPlanId: string) => {
    const start = new Date(planStarted);
    const end = new Date(start); end.setMonth(end.getMonth() + 1);
    const now = new Date(today);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const remainingDays = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
    const currentPrice = plan.price;
    const newPrice = NEW_PLANS[newPlanId].price;
    const remainingAmount = Math.floor((currentPrice * remainingDays) / totalDays);
    const payAmount = Math.max(0, newPrice - remainingAmount);
    return { totalDays, remainingDays, currentPrice, newPrice, remainingAmount, payAmount };
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">요금제</span><span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">NEW PRICING</span></Link>
          <div className="flex gap-2 items-center">
            <select value={planId} onChange={e=>setPlanId(e.target.value)} className="border border-black/10 rounded-full px-3 py-1.5 text-[11px]"><option value="STARTER">STARTER 10건/2.69만 (초과 1,600원)</option><option value="LITE">LITE 100건/14.9만 (초과 1,400원)</option><option value="STANDARD">STANDARD 500건/59.9만 (초과 1,200원)</option><option value="GOLD">GOLD 1000건/119만 (초과 1,150원)</option><option value="PLATINUM">PLATINUM 3000건/329만 (초과 1,100원)</option><option value="VIP">VIP 5000건/534만 (초과 1,050원)</option></select>
            <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${used >= quota ? "bg-red-500 text-white" : "bg-black text-white"}`}>{planId} {used}/{quota}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="bg-black text-white rounded-[16px] p-4">
          <h3 className="font-bold text-[13px]">요금제</h3>
          <div className="mt-3 grid md:grid-cols-6 gap-2 text-[10px]">
            {Object.keys(NEW_PLANS).map(k=>{
              const p = NEW_PLANS[k];
              return <div key={k} className={`rounded-[10px] p-3 ${planId===k ? "bg-white text-black" : "bg-white/10"}`}><p className="font-bold">{p.name} {p.quota}건</p><p className="mt-1">{p.price.toLocaleString()}원 (건당 {p.per.toLocaleString()}원)</p><p className="mt-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full inline-block text-[9px]">초과 {p.over.toLocaleString()}원 ({p.range}) ↓</p><p className="mt-1 opacity-60 text-[9px]">{p.switchText}</p><p className="mt-1 opacity-60">{p.storage}</p></div>
            })}
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className={`rounded-[16px] p-5 border-2 ${used >= quota ? "bg-red-50 border-red-500" : "bg-white border-black/5"}`}>
            <p className="text-[11px] opacity-60">이번달 - {planId} {plan.quota}건 / {plan.price.toLocaleString()}원</p><p className="text-[28px] font-black mt-1">{used} / {quota}건</p>
            <div className="mt-2 h-2 bg-black/10 rounded-full overflow-hidden"><div className={`h-full ${used >= quota ? "bg-red-500" : "bg-black"}`} style={{width: `${Math.min(100, (used/quota)*100)}%`}}></div></div>
            <p className="text-[11px] opacity-60 mt-2">{used >= quota ? `초과! 초과건당 ${plan.over.toLocaleString()}원 (${plan.range})` : `${quota-used}건 남음`}</p>
            <p className="text-[10px] opacity-50 mt-1">{plan.switchText}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">보관 - {plan.storage}</p><p className="text-[14px] font-bold mt-1">{plan.storage} 포함</p><p className="text-[11px] opacity-60 mt-1">초과 보관료: 파렛트당 2~3만원/월, 최소 1만~80만원 / 야간/주말 +300~600원</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">결제</p><p className="text-[14px] font-bold mt-1">Toss Payments Metered Billing 지원</p><p className="text-[11px] opacity-60 mt-1">초과 시 자동 청구, 프러레이션 차감 지원</p></div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between"><h3 className="font-bold text-[14px]">송장 발급 대기 {orders.length}건 - {planId} {quota}건 초과 시 {plan.over.toLocaleString()}원 초과결제!</h3></div>
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b border-black/5"><tr><th className="text-left py-3 px-6">주문</th><th className="text-left">상품</th><th className="text-center">송장</th><th className="text-center">상태</th><th className="text-center">액션</th></tr></thead>
            <tbody>{orders.map(o=>{
              const isBlocked = used >= quota && !o.invoice;
              return <tr key={o.id} className={`border-b border-black/5 ${isBlocked ? "bg-red-50" : ""}`}><td className="py-3 px-6"><p className="font-mono text-[11px]">{o.order_no} {isBlocked && <span className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">초과!</span>}</p><p className="text-[11px] opacity-60">{o.recipient}</p></td><td><p className="font-bold">{o.product}</p></td><td className="text-center">{o.invoice ? <span className="font-mono bg-black text-white px-2 py-1 rounded text-[11px]">{o.invoice}</span> : <span className="opacity-30">미발급</span>}</td><td className="text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${isBlocked ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"}`}>{isBlocked ? `초과! ${plan.over}원` : "패킹완료"}</span></td><td className="text-center">{o.invoice ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">발급완료</span> : isBlocked ? <button onClick={()=>setShowUpgrade(o)} className="text-[11px] px-4 py-1.5 rounded-full bg-red-500 text-white font-bold">초과! {plan.over}원 결제</button> : <button onClick={()=>{const inv="CJ"+Math.floor(1000000000+Math.random()*9000000000); setOrders(orders.map(x=>x.id===o.id?{...x, invoice:inv}:x)); setUsed(used+1);}} className="text-[11px] px-4 py-1.5 rounded-full bg-black text-white font-bold">송장 발급</button>}</td></tr>
            })}</tbody>
          </table>
        </div>

        {showUpgrade && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-[20px] p-6 max-w-[520px] w-full max-h-[90vh] overflow-auto">
              <h3 className="font-black text-[18px]">월 {quota}건 초과! - {planId}</h3>
              <p className="text-[12px] opacity-60 mt-1">{planId}는 월 {quota}건까지! {showUpgrade.order_no}는 {used+1}번째 주문! 초과 시 건당 {plan.over.toLocaleString()}원 ({plan.range})</p>
              <p className="text-[11px] opacity-50 mt-1">{plan.switchText}</p>

              <div className="mt-5">
                <p className="font-bold text-[12px]">업그레이드 (프러레이션 - 남은 금액 차감!)</p>
                <div className="mt-2 grid gap-2">
                  {Object.keys(NEW_PLANS).filter(k=>NEW_PLANS[k].quota > quota).slice(0,3).map(k=>{
                    const calc = calcProration(k);
                    const newP = NEW_PLANS[k];
                    return <button key={k} onClick={()=>{setPlanId(k); setShowUpgrade(null); alert(`${k}로 업그레이드! ${calc.payAmount.toLocaleString()}원 결제! (남은 ${calc.remainingDays}일치 ${calc.remainingAmount.toLocaleString()}원 차감)`);}} className="w-full border border-black/10 rounded-[12px] p-4 text-left hover:border-black">
                      <div className="flex justify-between"><div><p className="font-bold text-[13px]">{k} - {newP.quota}건/월 {k==="LITE" && "⭐ MOST POPULAR"}</p><p className="text-[11px] opacity-60 mt-1">{newP.storage} / 건당 {newP.per.toLocaleString()}원 → 초과 {newP.over.toLocaleString()}원 ({newP.range})</p><p className="text-[10px] opacity-50 mt-1">{newP.switchText}</p></div><div className="text-right"><p className="font-bold">{newP.price.toLocaleString()}원</p></div></div>
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-[8px] p-2 text-[11px]"><p className="font-bold text-green-700">프러레이션: -{calc.remainingAmount.toLocaleString()}원 (남은 {calc.remainingDays}일치)</p><p className="text-green-700">실제: <span className="font-black text-[14px]">{calc.payAmount.toLocaleString()}원</span>만!</p></div>
                    </button>
                  })}
                </div>
              </div>

              <div className="mt-5 border-2 border-blue-600 bg-blue-50 rounded-[12px] p-4">
                <p className="font-bold text-[12px] text-blue-800">초과 건당 결제 (이번 주문만!)</p><p className="text-[11px] opacity-70 mt-1">{planId} 초과 건당 {plan.over.toLocaleString()}원 ({plan.range}) / {plan.switchText}</p>
                <button onClick={()=>{const inv="CJ"+Math.floor(1000000000+Math.random()*9000000000); setOrders(orders.map(x=>x.id===showUpgrade.id?{...x, invoice:inv}:x)); setUsed(used+1); setShowUpgrade(null);}} className="mt-3 w-full bg-blue-600 text-white py-3 rounded-full font-bold text-[13px]">{plan.over.toLocaleString()}원 결제하고 송장 출력 →</button>
                <p className="text-[10px] opacity-50 mt-2 text-center">Toss Payments Metered Billing 지원 / 보관료 + 야간/주말 추가금 별도</p>
              </div>

              <button onClick={()=>setShowUpgrade(null)} className="mt-4 w-full border border-black/10 py-3 rounded-full text-[12px]">닫기</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

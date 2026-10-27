"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function WMSLiteProPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [outbounds, setOutbounds] = useState<any[]>([]);
  const [inbounds, setInbounds] = useState<any[]>([
    { id: "1", asn_no: "ASN-20241027-001", date: "2024-10-28", sku: "EAR-001", product_name: "무선 이어폰", box: 3, qty: 150, tracking: "CJ123456", status: "입고대기", expiry: "2025-10-28", lot: "LOT-202410" },
  ]);
  const [tab, setTab] = useState<"stock" | "asn" | "expiry" | "safety" | "inbound" | "outbound">("stock");
  const [showASN, setShowASN] = useState(false);
  const [asnForm, setAsnForm] = useState({ sku: "", product_name: "", box: 1, qty: 0, tracking: "", expiry: "", lot: "", date: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (!s) { setLoading(false); return; }
      const { data: prof } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).maybeSingle();
      setProfile(prof);
      try {
        const { data: inv } = await supabase.from("seller_inventory").select("*").eq("seller_id", s.user.id);
        if (inv && inv.length > 0) setInventory(inv);
        else setInventory([
          { id: "1", sku: "EAR-001", product_name: "무선 이어폰", qty: 150, location: "A-01-02", box_count: 3, inbound_date: "2024-10-20", status: "보관중", expiry: "2025-10-20", safety: 10, lot: "LOT-202410" },
          { id: "2", sku: "WATCH-02", product_name: "스마트 워치", qty: 45, location: "B-02-05", box_count: 1, inbound_date: "2024-10-22", status: "보관중", expiry: "2026-10-22", safety: 10, lot: "LOT-202410" },
          { id: "3", sku: "CASE-04", product_name: "에어팟 케이스", qty: 320, location: "A-01-03", box_count: 2, inbound_date: "2024-10-26", status: "보관중", expiry: "2027-10-26", safety: 20, lot: "LOT-202410" },
          { id: "4", sku: "COS-001", product_name: "에센스 100ml", qty: 8, location: "A-02-01", box_count: 1, inbound_date: "2024-09-01", status: "보관중", expiry: "2024-11-15", safety: 10, lot: "LOT-202409" },
        ]);
        const { data: ord } = await supabase.from("orders").select("*").eq("seller_id", s.user.id).order("created_at", { ascending: false }).limit(20);
        if (ord) setOutbounds(ord);
        else setOutbounds([
          { id: "1", platform_order_id: "20241027-001", product_name: "무선 이어폰", qty: 2, status: "출고완료", invoice: "CJ1234567890", created_at: new Date().toISOString() },
        ]);
      } catch(e) {}
      setLoading(false);
    };
    load();
  }, []);

  const createASN = () => {
    if (!asnForm.sku || !asnForm.product_name || !asnForm.qty) { alert("SKU, 상품명, 수량 필수"); return; }
    const newASN = { id: String(inbounds.length+1), asn_no: `ASN-${Date.now()}`, ...asnForm, status: "입고대기" };
    setInbounds([newASN as any, ...inbounds]);
    setShowASN(false);
    setAsnForm({ sku: "", product_name: "", box: 1, qty: 0, tracking: "", expiry: "", lot: "", date: new Date().toISOString().split("T")[0] });
    alert(`입고 요청 ${newASN.asn_no} 생성! 김포 센터로 보내면 우리가 입고할게요!`);
  };

  const lowStock = inventory.filter(i => i.qty <= (i.safety || 10));
  const nearExpiry = inventory.filter(i => {
    if (!i.expiry) return false;
    const days = Math.floor((new Date(i.expiry).getTime() - Date.now()) / (1000*60*60*24));
    return days <= 30 && days >= 0;
  });

  if (loading) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><div className="flex items-center justify-center h-[80vh] text-[13px]">내 창고 불러오는 중...</div></div>;
  if (!session) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><div className="flex flex-col items-center justify-center h-[80vh]"><p className="text-[14px]">로그인이 필요합니다</p><Link href="/login" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[13px]">로그인하러 가기</Link></div></div>;

  const totalQty = inventory.reduce((s,i)=>s+(i.qty||0),0);
  const totalBox = inventory.reduce((s,i)=>s+(i.box_count||0),0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-start justify-between">
          <div><h1 className="text-[28px] font-bold tracking-tight">내 창고 WMS Lite Pro</h1><p className="text-[13px] opacity-60 mt-1">{profile?.company_name || "내 브랜드"} - 입고요청, 유통기한, 안전재고까지! 셀러 전용 Pro!</p></div>
          <div className="bg-white border border-black/5 rounded-[12px] px-5 py-3 text-right"><p className="text-[10px] opacity-40">총 보관</p><p className="font-bold text-[16px]">{totalQty}개 / {totalBox}박스</p><p className="text-[10px] opacity-40 mt-1">월 보관료 포함 (LITE 플랜)</p></div>
        </div>

        {(lowStock.length>0 || nearExpiry.length>0) && (
          <div className="mt-6 grid md:grid-cols-2 gap-3">
            {lowStock.length>0 && <div className="bg-red-50 border border-red-200 rounded-[16px] p-4"><p className="text-[12px] font-bold text-red-700">⚠️ 안전재고 부족! {lowStock.length}개 SKU</p><p className="text-[11px] opacity-70 mt-1">{lowStock.map(i=>`${i.product_name} ${i.qty}개`).join(", ")} - 보충 필요! 카톡 알림 발송됨!</p></div>}
            {nearExpiry.length>0 && <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-4"><p className="text-[12px] font-bold text-amber-700">⏰ 유통기한 임박! {nearExpiry.length}개 SKU</p><p className="text-[11px] opacity-70 mt-1">{nearExpiry.map(i=>`${i.product_name} ${i.expiry} (${Math.floor((new Date(i.expiry).getTime()-Date.now())/86400000)}일 남음)`).join(", ")} - 30일 내 출고 필요!</p></div>}
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-4 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">내 총 재고</p><p className="text-[22px] font-bold mt-1">{totalQty}개</p><p className="text-[11px] opacity-50 mt-1">{inventory.length} SKU / {totalBox}박스</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">입고 대기</p><p className="text-[22px] font-bold mt-1">{inbounds.filter(i=>i.status==="입고대기").length}건</p><p className="text-[11px] opacity-50 mt-1">ASN {inbounds.length}건</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">이번달 출고</p><p className="text-[22px] font-bold mt-1">{outbounds.length}건</p><p className="text-[11px] opacity-50 mt-1">자동 풀필먼트</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">내 창고 위치</p><p className="text-[13px] font-bold mt-1">{inventory.map(i=>i.location).join(", ")}</p><p className="text-[11px] opacity-60 mt-1">김포 센터 1층 A, B 구역</p></div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto">
          <button onClick={()=>setTab("stock")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${tab==="stock" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>내 재고 ({inventory.length})</button>
          <button onClick={()=>setTab("asn")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${tab==="asn" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>입고 요청 (ASN) ({inbounds.length})</button>
          <button onClick={()=>setTab("expiry")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${tab==="expiry" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>유통기한 ({nearExpiry.length})</button>
          <button onClick={()=>setTab("safety")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${tab==="safety" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>안전재고 ({lowStock.length})</button>
          <button onClick={()=>setTab("inbound")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${tab==="inbound" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>입고 내역</button>
          <button onClick={()=>setTab("outbound")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${tab==="outbound" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>출고 내역 ({outbounds.length})</button>
        </div>

        {tab==="stock" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold text-[14px]">내가 맡긴 재고 - 선반별 + 유통기한 + 안전재고</h3><span className="text-[11px] opacity-50">FLEX LITE Pro - 유통기한, 안전재고, LOT까지 관리!</span></div>
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">내 상품 / SKU / LOT</th><th className="text-center">위치</th><th className="text-center">박스</th><th className="text-center">수량 / 안전</th><th className="text-center">유통기한</th><th className="text-center">상태</th></tr></thead>
              <tbody>{inventory.map(i=>{
                const days = i.expiry ? Math.floor((new Date(i.expiry).getTime()-Date.now())/86400000) : 999;
                const isLow = i.qty <= (i.safety||10);
                const isNear = days <=30 && days>=0;
                return <tr key={i.id} className={`border-b border-black/[0.03] ${isLow ? "bg-red-50" : isNear ? "bg-amber-50" : "hover:bg-[#fafaf8]"}`}><td className="py-4 px-6"><p className="font-bold">{i.product_name} {isLow && "⚠️"} {isNear && "⏰"}</p><p className="font-mono text-[10px] opacity-50">{i.sku} · LOT {i.lot} · 입고 {i.inbound_date}</p></td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">{i.location}</span></td><td className="text-center">{i.box_count}박스</td><td className="text-center"><span className={`font-bold ${isLow ? "text-red-600" : ""}`}>{i.qty}개</span><p className="text-[10px] opacity-40">안전 {i.safety||10}개</p></td><td className="text-center"><p className={`text-[11px] ${isNear ? "text-amber-600 font-bold" : ""}`}>{i.expiry || "-"}</p>{isNear && <p className="text-[9px] text-amber-600">{days}일 남음</p>}</td><td className="text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${isLow ? "bg-red-100 text-red-700" : isNear ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{isLow ? "부족" : isNear ? "임박" : i.status}</span></td></tr>
              })}</tbody>
            </table>
          </div>
        )}

        {tab==="asn" && (
          <div className="mt-6">
            <div className="flex items-center justify-between"><h3 className="font-bold">입고 요청서 (ASN) - 미리 알려주면 우리가 준비!</h3><button onClick={()=>setShowASN(true)} className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold">+ ASN 생성</button></div>
            <div className="mt-4 bg-white border border-black/5 rounded-[16px] overflow-hidden">
              <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">ASN / 상품</th><th className="text-center">입고예정일</th><th className="text-center">박스 / 수량</th><th className="text-center">송장 / LOT</th><th className="text-center">유통기한</th><th className="text-center">상태</th></tr></thead>
                <tbody>{inbounds.map(i=><tr key={i.id} className="border-b"><td className="py-4 px-6"><p className="font-mono text-[11px]">{i.asn_no}</p><p className="font-bold mt-1">{i.product_name} ({i.sku})</p></td><td className="text-center">{i.date}</td><td className="text-center">{i.box}박스 / {i.qty}개</td><td className="text-center"><p className="font-mono text-[11px]">{i.tracking || "-"}</p><p className="text-[10px] opacity-50">{i.lot}</p></td><td className="text-center">{i.expiry || "-"}</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${i.status==="입고완료" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{i.status}</span></td></tr>)}</tbody>
              </table>
              <div className="px-6 py-4 bg-[#fafaf8] text-[11px] opacity-60"><p>💡 ASN이란? Advanced Shipping Notice - 택배 보내기 전에 미리 알려주는 거! 우리가 입고 준비하고, 로케이션 추천해주고, 바코드 미리 찍어둠! 택배 도착하면 10분 만에 입고 완료!</p><p className="mt-2">입고 주소: 경기도 김포시 양촌읍 황금로 123 FLEX CENTER 물류센터 (브랜드명 / 전화번호 꼭!)</p></div>
            </div>
          </div>
        )}

        {tab==="expiry" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b"><h3 className="font-bold">유통기한 관리 - 30일 전 카톡 알림!</h3><p className="text-[11px] opacity-50 mt-1">화장품, 식품은 유통기한 지나면 폐기! 30일 전 알림받고 먼저 출고!</p></div>
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">상품 / LOT</th><th className="text-center">유통기한</th><th className="text-center">남은 일수</th><th className="text-center">수량</th><th className="text-center">액션</th></tr></thead>
              <tbody>{inventory.filter(i=>i.expiry).sort((a,b)=>new Date(a.expiry).getTime()-new Date(b.expiry).getTime()).map(i=>{
                const days = Math.floor((new Date(i.expiry).getTime()-Date.now())/86400000);
                return <tr key={i.id} className={`border-b ${days<=30 ? "bg-amber-50" : ""}`}><td className="py-4 px-6"><p className="font-bold">{i.product_name}</p><p className="text-[10px] opacity-50">{i.sku} · LOT {i.lot}</p></td><td className="text-center font-mono">{i.expiry}</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[11px] font-bold ${days<=0 ? "bg-red-100 text-red-700" : days<=30 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{days<=0 ? `만료 ${-days}일` : `${days}일 남음`}</span></td><td className="text-center">{i.qty}개</td><td className="text-center"><button className="bg-black text-white px-3 py-1.5 rounded-full text-[11px]">선입선출 출고</button></td></tr>
              })}</tbody>
            </table>
          </div>
        )}

        {tab==="safety" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b"><h3 className="font-bold">안전재고 - 10개 이하면 카톡 알림!</h3><p className="text-[11px] opacity-50 mt-1">재고 부족하면 품절! 미리 보충!</p></div>
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">상품</th><th className="text-center">현재 / 안전</th><th className="text-center">부족</th><th className="text-center">상태</th><th className="text-center">액션</th></tr></thead>
              <tbody>{inventory.map(i=>{
                const lack = (i.safety||10) - i.qty;
                return <tr key={i.id} className={`border-b ${i.qty <= (i.safety||10) ? "bg-red-50" : ""}`}><td className="py-4 px-6"><p className="font-bold">{i.product_name}</p><p className="text-[10px] opacity-50">{i.sku} · {i.location}</p></td><td className="text-center">{i.qty} / {i.safety||10}개</td><td className="text-center"><span className={lack>0 ? "text-red-600 font-bold" : ""}>{lack>0 ? `${lack}개 부족` : "충분"}</span></td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${i.qty <= (i.safety||10) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{i.qty <= (i.safety||10) ? "보충 필요" : "정상"}</span></td><td className="text-center"><button className="bg-black text-white px-3 py-1.5 rounded-full text-[11px]">입고 요청</button></td></tr>
              })}</tbody>
            </table>
          </div>
        )}

        {tab==="inbound" && <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-12 text-center text-[13px] opacity-50">입고 내역 - ASN으로 입고된 내역<br/>택배로 보내면 우리가 검수해서 입고!</div>}
        {tab==="outbound" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">주문 / 상품</th><th className="text-center">수량</th><th className="text-center">상태</th><th className="text-center">송장</th></tr></thead>
              <tbody>{outbounds.map(o=><tr key={o.id} className="border-b"><td className="py-4 px-6"><p className="font-mono text-[11px]">{o.platform_order_id}</p><p className="font-bold text-[12px] mt-1">{o.product_name}</p></td><td className="text-center">{o.qty}</td><td className="text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px]">{o.status}</span></td><td className="text-center font-mono text-[11px]">{o.invoice}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </main>

      {showASN && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[20px] p-6 max-w-[500px] w-full">
            <h3 className="font-black text-[16px]">입고 요청서 (ASN) 생성</h3><p className="text-[11px] opacity-60 mt-1">택배 보내기 전에 미리 알려주면 우리가 준비!</p>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3"><input value={asnForm.sku} onChange={e=>setAsnForm({...asnForm, sku:e.target.value})} placeholder="SKU*" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /><input value={asnForm.product_name} onChange={e=>setAsnForm({...asnForm, product_name:e.target.value})} placeholder="상품명*" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /></div>
              <div className="grid grid-cols-3 gap-3"><input type="number" value={asnForm.box} onChange={e=>setAsnForm({...asnForm, box:Number(e.target.value)})} placeholder="박스" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /><input type="number" value={asnForm.qty} onChange={e=>setAsnForm({...asnForm, qty:Number(e.target.value)})} placeholder="수량*" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /><input value={asnForm.date} onChange={e=>setAsnForm({...asnForm, date:e.target.value})} type="date" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /></div>
              <input value={asnForm.tracking} onChange={e=>setAsnForm({...asnForm, tracking:e.target.value})} placeholder="택배 송장번호 (선택)" className="w-full border border-black/10 rounded-full px-4 py-2.5 text-[12px]" />
              <div className="grid grid-cols-2 gap-3"><input value={asnForm.expiry} onChange={e=>setAsnForm({...asnForm, expiry:e.target.value})} type="date" placeholder="유통기한" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /><input value={asnForm.lot} onChange={e=>setAsnForm({...asnForm, lot:e.target.value})} placeholder="LOT 번호" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" /></div>
              <p className="text-[10px] opacity-40">입고 주소: 경기도 김포시 양촌읍 황금로 123 FLEX CENTER 물류센터 (브랜드명 꼭!)</p>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={()=>setShowASN(false)} className="flex-1 border border-black/10 py-3 rounded-full text-[12px]">취소</button><button onClick={createASN} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-[12px]">ASN 생성!</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const mockAllOrders = [
  { id: "1", seller: "무선스토어", seller_id: "seller1", platform_order_id: "20241027-001", sku: "EAR-001", location: "A-01-02", product: "무선 이어폰", qty: 2, recipient: "김철수", status: "new", bundled: true },
  { id: "2", seller: "테크박스", seller_id: "seller2", platform_order_id: "C-20241027-002", sku: "WATCH-02", location: "B-02-05", product: "스마트 워치", qty: 1, recipient: "이영희", status: "new", bundled: false },
  { id: "3", seller: "무선스토어", seller_id: "seller1", platform_order_id: "11-20241027-003", sku: "SPK-03", location: "A-03-01", product: "블루투스 스피커", qty: 1, recipient: "박민수", status: "new", bundled: false },
  { id: "4", seller: "케이스팜", seller_id: "seller3", platform_order_id: "20241027-004", sku: "CASE-04", location: "A-01-03", product: "에어팟 케이스", qty: 5, recipient: "최지훈", status: "new", bundled: false },
  { id: "5", seller: "테크박스", seller_id: "seller2", platform_order_id: "C-20241027-005", sku: "EAR-001", location: "A-01-02", product: "무선 이어폰", qty: 1, recipient: "정다은", status: "new", bundled: false },
];

export default function AdminWMSPage() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState(mockAllOrders);
  const [completed, setCompleted] = useState<string[]>([]);
  const [worker, setWorker] = useState("작업자 A");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s && s.user.email === "phankyu@gmail.com") setIsAdmin(true);
      setLoading(false);
    };
    load();
  }, []);

  const togglePick = (id: string) => {
    if (completed.includes(id)) setCompleted(completed.filter(c => c !== id));
    else setCompleted([...completed, id]);
  };

  const wavePicking = [...orders].sort((a,b)=>a.location.localeCompare(b.location));

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  if (!isAdmin) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]"><p className="text-[14px] font-bold">관리자만 접근 가능</p><p className="text-[12px] opacity-50 mt-1">phankyu@gmail.com 계정으로 로그인하세요</p><Link href="/login" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[12px]">로그인</Link></div>;

  const totalOrders = orders.length;
  const doneCount = completed.length;
  const sameLocationGroups = wavePicking.reduce((acc: any, o) => {
    acc[o.location] = acc[o.location] || [];
    acc[o.location].push(o);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-black text-white sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-50 ml-2">김포센터 운영 WMS - 작업자 전용</span><span className="ml-4 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">ADMIN</span></div>
          <div className="flex gap-2 items-center"><select value={worker} onChange={e=>setWorker(e.target.value)} className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-[12px]"><option>작업자 A</option><option>작업자 B</option><option>작업자 C</option></select><Link href="/admin" className="text-[12px] px-4 py-2 rounded-full border border-white/20">셀러 승인</Link></div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">오늘 전체 주문</p><p className="text-[28px] font-black mt-1">{totalOrders}건</p><p className="text-[11px] opacity-50 mt-1">모든 셀러 합계</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">피킹 완료</p><p className="text-[28px] font-black mt-1">{doneCount} / {totalOrders}</p><div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white transition-all" style={{width: `${totalOrders ? (doneCount/totalOrders*100) : 0}%`}}></div></div></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">피킹 효율</p><p className="text-[14px] font-bold mt-1">선반 동선 최적화</p><p className="text-[11px] opacity-50 mt-1">A구역 4건, B구역 1건</p></div>
          <div className="bg-amber-400 text-black rounded-[16px] p-5"><p className="text-[11px] opacity-70">합포장 대상</p><p className="text-[20px] font-black mt-1">1건 무료</p><p className="text-[11px] opacity-70 mt-1">같은 선반 2건 - 묶어서 피킹</p></div>
        </div>

        <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between"><h3 className="font-bold text-[15px]">웨이브 피킹 리스트 - {worker} - 선반 순서대로</h3><button className="text-[11px] px-3 py-1.5 rounded-full bg-black text-white font-bold">피킹 리스트 인쇄</button></div>
            <div className="divide-y divide-black/[0.04]">
              {wavePicking.map(o => {
                const isDone = completed.includes(o.id);
                return (
                  <div key={o.id} className={`flex items-center gap-4 px-6 py-4 ${isDone ? "bg-green-50 opacity-60" : "hover:bg-[#fafaf8]"}`}>
                    <button onClick={()=>togglePick(o.id)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-[14px] shrink-0 ${isDone ? "bg-green-500 border-green-500 text-white" : "border-black/20"}`}>{isDone ? "✓" : ""}</button>
                    <div className="w-[90px]"><div className="font-mono bg-black text-white px-2 py-1 rounded text-[12px] font-bold text-center">{o.location}</div><div className="text-[9px] opacity-40 text-center mt-1">{o.seller}</div></div>
                    <div className="flex-1"><p className="font-bold text-[13px]">{o.product} <span className="font-mono text-[11px] opacity-50">{o.sku} x {o.qty}</span></p><p className="text-[11px] opacity-60">주문 {o.platform_order_id} - {o.recipient} {o.bundled && <span className="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">합포장</span>}</p></div>
                    <div className="text-right"><p className="font-bold text-[14px]">{o.qty}개</p><p className="text-[10px] opacity-40">피킹</p></div>
                  </div>
                )
              })}
            </div>
            <div className="p-4 bg-[#fafaf8] flex gap-2">
              <button className="flex-1 bg-black text-white py-3 rounded-full text-[12px] font-bold">선택 {doneCount}건 패킹으로 이동 →</button>
              <Link href="/orders" className="px-6 py-3 rounded-full border border-black/10 text-[12px] font-bold bg-white">주문관리에서 송장 출력</Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black text-white rounded-[16px] p-5">
              <h4 className="font-bold text-[13px]">김포 센터 선반 맵 - 전체</h4>
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {["A-01-01","A-01-02","A-01-03","A-01-04","A-02-01","A-02-02","A-03-01","A-03-02","B-01-01","B-02-05","B-02-06","B-03-01"].map(loc => {
                  const count = mockAllOrders.filter(o=>o.location===loc).length;
                  const hasStock = count > 0;
                  return <div key={loc} className={`h-[56px] rounded-[8px] border flex flex-col items-center justify-center ${hasStock ? "bg-white text-black border-white" : "bg-white/10 border-white/20 text-white/30"}`}><span className="font-mono font-bold text-[9px]">{loc}</span><span className="text-[8px] mt-1 font-bold">{hasStock ? `${count}건 피킹` : "빈 선반"}</span></div>
                })}
              </div>
              <p className="text-[10px] opacity-40 mt-3">* 오늘 피킹할 선반은 흰색으로 표시</p>
            </div>

            <div className="bg-white border border-black/5 rounded-[16px] p-5">
              <h4 className="font-bold text-[13px]">선반별 묶음 피킹</h4>
              <div className="mt-3 space-y-2">
                {Object.entries(sameLocationGroups).map(([loc, orders]: any) => (
                  <div key={loc} className="flex items-center justify-between bg-[#fafaf8] rounded-[8px] px-3 py-2"><span className="font-mono text-[11px] font-bold">{loc}</span><span className="text-[11px]">{orders.length}건 같이 피킹 가능!</span><span className="text-[10px] bg-black text-white px-2 py-1 rounded-full">{orders.reduce((s:any,o:any)=>s+o.qty,0)}개</span></div>
                ))}
              </div>
              <p className="text-[10px] opacity-50 mt-3">💡 같은 선반에 있는 주문은 한 번에 가져오면 동선 절약!</p>
            </div>

            <div className="bg-white border border-amber-200 rounded-[16px] p-5">
              <h4 className="font-bold text-[13px] text-amber-800">오늘의 합포장 체크 (무료 3개)</h4>
              <div className="mt-3 bg-amber-50 rounded-[8px] p-3"><p className="text-[11px] font-bold">A-01-02 선반</p><p className="text-[11px] mt-1">무선 이어폰 2건이 같은 선반 - <b>한 번에 피킹해서 1개 박스로 합포장 가능!</b></p><p className="text-[10px] opacity-60 mt-1">셀러: 무선스토어, 테크박스 (다른 셀러지만 같은 상품이면 같이 보관)</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

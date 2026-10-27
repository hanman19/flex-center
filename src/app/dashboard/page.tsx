"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "inventory" | "orders" | "platforms">("stats");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("user", user);
      if (!user) { setLoading(false); return; }
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession({ user, ...s });
      try {
        const { data: prof } = await supabase.from("seller_profiles").select("*").eq("user_id", user.id).maybeSingle();
        setProfile(prof);
        const { data: inv } = await supabase.from("seller_inventory").select("*").eq("seller_id", user.id);
        if (inv && inv.length > 0) setInventory(inv);
        else setInventory([
          { id: "1", sku: "EAR-001", product_name: "무선 이어폰", qty: 150, location: "A-01-02", box_count: 3 },
          { id: "2", sku: "WATCH-02", product_name: "스마트 워치", qty: 45, location: "B-02-05", box_count: 1 },
          { id: "3", sku: "CASE-04", product_name: "에어팟 케이스", qty: 320, location: "A-01-03", box_count: 2 },
        ]);
        const { data: ord } = await supabase.from("orders").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }).limit(20);
        if (ord) setOrders(ord);
        else setOrders([
          { id: "1", platform_order_id: "20241027-001", product_name: "무선 이어폰", qty: 2, status: "출고완료", invoice: "CJ1234567890" },
          { id: "2", platform_order_id: "C-002", product_name: "스마트 워치", qty: 1, status: "피킹중", invoice: "" },
        ]);
      } catch(e) { console.log(e); }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]">
        <p className="text-[14px]">로그인이 필요합니다</p>
        <Link href="/login" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[13px]">로그인하러 가기</Link>
      </div>
    );
  }

  const totalQty = inventory.reduce((sum, i) => sum + (i.qty || 0), 0);
  const totalBox = inventory.reduce((sum, i) => sum + (i.box_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-tight">대시보드</h1>
            <p className="text-[13px] opacity-60 mt-1">{profile?.company_name || session.user.email} - 김포 FLEX CENTER</p>
          </div>
          <div className="bg-white border border-black/5 rounded-[12px] px-5 py-3 text-right">
            <p className="text-[10px] opacity-40">총 보관</p><p className="font-bold text-[16px]">{totalQty}개 / {totalBox}박스</p>
            <p className="text-[10px] opacity-40 mt-1">{profile?.plan || "STARTER"} 플랜</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">오늘 주문</p><p className="text-[22px] font-bold mt-1">{orders.length}건</p><p className="text-[11px] opacity-50 mt-2">자동 풀필먼트</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">내 재고</p><p className="text-[22px] font-bold mt-1">{totalQty}개</p><p className="text-[11px] opacity-50 mt-2">{inventory.length}개 SKU / {totalBox}박스</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">출고 완료</p><p className="text-[22px] font-bold mt-1">98.5%</p><p className="text-[11px] opacity-50 mt-2">정확도</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">요금제</p><p className="text-[16px] font-bold mt-1">{profile?.plan || "STARTER"} / {profile?.company_name || "내 브랜드"}</p><p className="text-[11px] opacity-60 mt-2">김포 센터</p></div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={()=>setActiveTab("stats")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${activeTab==="stats" ? "bg-black text-white" : "bg-white border-black/10"}`}>통계</button>
          <button onClick={()=>setActiveTab("inventory")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${activeTab==="inventory" ? "bg-black text-white" : "bg-white border-black/10"}`}>내 재고 ({inventory.length})</button>
          <button onClick={()=>setActiveTab("orders")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${activeTab==="orders" ? "bg-black text-white" : "bg-white border-black/10"}`}>최근 주문 ({orders.length})</button>
          <button onClick={()=>setActiveTab("platforms")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${activeTab==="platforms" ? "bg-black text-white" : "bg-white border-black/10"}`}>바로가기</button>
        </div>

        {activeTab==="stats" && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-black/5 rounded-[16px] p-6"><h3 className="font-bold text-[14px]">이번달 출고</h3><p className="text-[28px] font-black mt-3">{orders.length}건</p><p className="text-[11px] opacity-50 mt-2">월 {profile?.plan || "10건"} 중 {orders.length}건 사용</p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-6"><h3 className="font-bold text-[14px]">보관 위치</h3><p className="text-[13px] font-mono mt-3">{inventory.map(i=>i.location).join(", ")}</p><p className="text-[11px] opacity-50 mt-2">김포 센터 1층 A, B 구역</p></div>
            <div className="bg-[#FFC61A] border border-black rounded-[16px] p-6"><h3 className="font-bold text-[14px] text-black">빠른 액션</h3><div className="mt-3 flex flex-col gap-2"><Link href="/products" className="bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold text-center">📦 상품 등록하기</Link><Link href="/wms" className="bg-white text-black border border-black px-4 py-2 rounded-full text-[11px] font-bold text-center">내 창고 보기</Link></div></div>
          </div>
        )}

        {activeTab==="inventory" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">상품 / SKU</th><th className="text-center">위치</th><th className="text-center">수량</th><th className="text-center">상태</th></tr></thead>
              <tbody>{inventory.map(i=><tr key={i.id} className="border-b border-black/[0.03]"><td className="py-4 px-6"><p className="font-bold">{i.product_name}</p><p className="font-mono text-[10px] opacity-50">{i.sku}</p></td><td className="text-center"><span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">{i.location}</span></td><td className="text-center font-bold">{i.qty}개</td><td className="text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px]">보관중</span></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {activeTab==="orders" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">주문번호 / 상품</th><th className="text-center">수량</th><th className="text-center">상태</th><th className="text-center">송장</th></tr></thead>
              <tbody>{orders.map(o=><tr key={o.id} className="border-b"><td className="py-4 px-6"><p className="font-mono text-[11px]">{o.platform_order_id}</p><p className="font-bold text-[12px] mt-1">{o.product_name}</p></td><td className="text-center">{o.qty}</td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${o.status==="출고완료" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{o.status}</span></td><td className="text-center font-mono text-[11px]">{o.invoice || "-"}</td></tr>)}</tbody>
            </table>
          </div>
        )}

        {activeTab==="platforms" && (
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            <Link href="/products" className="bg-white border border-black/5 rounded-[16px] p-6 hover:shadow-lg transition"><p className="text-[14px] font-bold">📦 상품 마스터</p><p className="text-[11px] opacity-60 mt-2">SKU, 바코드, 세트 관리</p></Link>
            <Link href="/wms" className="bg-white border border-black/5 rounded-[16px] p-6 hover:shadow-lg transition"><p className="text-[14px] font-bold">내 창고 WMS</p><p className="text-[11px] opacity-60 mt-2">내 재고, 입고, 출고 확인</p></Link>
            <Link href="/orders" className="bg-white border border-black/5 rounded-[16px] p-6 hover:shadow-lg transition"><p className="text-[14px] font-bold">주문관리</p><p className="text-[11px] opacity-60 mt-2">주문, 송장, 합포장</p></Link>
            <Link href="/platforms" className="bg-white border border-black/5 rounded-[16px] p-6 hover:shadow-lg transition"><p className="text-[14px] font-bold">플랫폼 연동</p><p className="text-[11px] opacity-60 mt-2">네이버, 쿠팡, 11번가</p></Link>
          </div>
        )}
      </main>
    </div>
  );
}

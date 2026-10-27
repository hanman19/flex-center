"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function WMSPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [inbounds, setInbounds] = useState<any[]>([]);
  const [outbounds, setOutbounds] = useState<any[]>([]);
  const [tab, setTab] = useState<"stock" | "inbound" | "outbound">("stock");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (!s) { setLoading(false); return; }

      const { data: prof } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).maybeSingle();
      setProfile(prof);

      // 실제 inventory 테이블이 있으면 가져오고, 없으면 샘플 보여주기
      try {
        const { data: inv } = await supabase.from("seller_inventory").select("*").eq("seller_id", s.user.id);
        if (inv && inv.length > 0) setInventory(inv);
        else {
          // 샘플 데이터 - 셀러용이니까 내 재고만
          setInventory([
            { id: "1", sku: "EAR-001", product_name: "무선 이어폰", qty: 150, location: "A-01-02", box_count: 3, inbound_date: "2024-10-20", status: "보관중" },
            { id: "2", sku: "WATCH-02", product_name: "스마트 워치", qty: 45, location: "B-02-05", box_count: 1, inbound_date: "2024-10-22", status: "보관중" },
            { id: "3", sku: "CASE-04", product_name: "에어팟 케이스", qty: 320, location: "A-01-03", box_count: 2, inbound_date: "2024-10-26", status: "보관중" },
          ]);
        }
        const { data: ord } = await supabase.from("orders").select("*").eq("seller_id", s.user.id).order("created_at", { ascending: false }).limit(20);
        if (ord) {
          setOutbounds(ord);
        } else {
          setOutbounds([
            { id: "1", platform_order_id: "20241027-001", product_name: "무선 이어폰", qty: 2, status: "출고완료", invoice: "CJ1234567890", created_at: new Date().toISOString() },
            { id: "2", platform_order_id: "C-20241027-002", product_name: "스마트 워치", qty: 1, status: "피킹중", invoice: "", created_at: new Date().toISOString() },
          ]);
        }
      } catch(e) {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[13px]">
      <TopNav />내 창고 불러오는 중...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]">
        <p className="text-[14px]">로그인이 필요합니다</p>
        <Link href="/login" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[13px]">로그인하러 가기</Link>
      </div>
    )
  }

  const totalQty = inventory.reduce((sum, i) => sum + (i.qty || 0), 0);
  const totalBox = inventory.reduce((sum, i) => sum + (i.box_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">내 창고 - FLEX LITE</span></Link>
          <div className="flex gap-2"><Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full border">회원전용</Link><Link href="/orders" className="text-[12px] px-4 py-2 rounded-full border">주문관리</Link></div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">내 창고 현황</h1>
            <p className="text-[13px] opacity-60 mt-1">{profile?.company_name || "내 브랜드"} - 김포 FLEX CENTER에 보관중인 내 재고예요</p>
          </div>
          <div className="bg-white border border-black/5 rounded-[12px] px-5 py-3 text-right">
            <p className="text-[10px] opacity-40">총 보관</p><p className="font-bold text-[16px]">{totalQty}개 / {totalBox}박스</p><p className="text-[10px] opacity-40 mt-1">월 보관료 포함 (LITE 플랜)</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-3">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">내 총 재고</p><p className="text-[22px] font-bold mt-1">{totalQty}개</p><p className="text-[11px] opacity-50 mt-2">3개 SKU / {totalBox}박스</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">이번달 출고</p><p className="text-[22px] font-bold mt-1">{outbounds.length}건</p><p className="text-[11px] opacity-50 mt-2">자동 풀필먼트로 출고됨</p></div>
          <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">내 창고 위치</p><p className="text-[14px] font-bold mt-1">{inventory.map(i=>i.location).join(", ") || "A-01-02"}</p><p className="text-[11px] opacity-60 mt-2">김포 센터 1층 A, B 구역</p></div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={()=>setTab("stock")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="stock" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>내 재고 ({inventory.length})</button>
          <button onClick={()=>setTab("inbound")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="inbound" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>입고 내역</button>
          <button onClick={()=>setTab("outbound")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="outbound" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>출고 내역 ({outbounds.length})</button>
        </div>

        {tab==="stock" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between"><h3 className="font-bold text-[14px]">내가 맡긴 재고 - 선반별</h3><span className="text-[11px] opacity-50">FLEX LITE는 선반 단위로 내 박스만 관리돼요</span></div>
            <table className="w-full text-[12px]">
              <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b border-black/5"><tr><th className="text-left py-3 px-6">내 상품 / SKU</th><th className="text-center">내 박스 위치</th><th className="text-center">박스 수</th><th className="text-center">남은 수량</th><th className="text-center">상태</th></tr></thead>
              <tbody>
                {inventory.map(i => (
                  <tr key={i.id} className="border-b border-black/[0.03] hover:bg-[#fafaf8]">
                    <td className="py-4 px-6"><p className="font-bold">{i.product_name}</p><p className="font-mono text-[10px] opacity-50">{i.sku} - 입고 {i.inbound_date}</p></td>
                    <td className="text-center"><span className="font-mono bg-black text-white px-3 py-1 rounded-full text-[11px] font-bold">{i.location}</span><p className="text-[9px] opacity-40 mt-1">김포 센터</p></td>
                    <td className="text-center font-bold">{i.box_count}박스</td>
                    <td className="text-center"><span className="font-bold">{i.qty}개</span></td>
                    <td className="text-center"><span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">{i.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-[#fafaf8] text-[11px] opacity-60">
              <p>💡 <b>FLEX LITE 안내:</b> 내 재고는 김포 센터 A, B 구역 선반에 안전하게 보관돼요. 주문이 들어오면 우리 작업자가 내 선반에서 꺼내서 자동으로 포장, 송장 붙여서 출고해요. 나는 WMS에서 재고만 확인하면 돼요!</p>
            </div>
          </div>
        )}

        {tab==="inbound" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-12 text-center">
            <p className="text-[14px] font-bold">입고 신청하기</p><p className="text-[12px] opacity-50 mt-2">택배로 김포 센터로 보내면 우리가 입고해서 내 선반에 넣어드려요</p>
            <div className="mt-6 bg-[#fafaf8] rounded-[12px] p-4 text-left max-w-[500px] mx-auto">
              <p className="text-[11px] font-bold">입고 주소</p><p className="text-[12px] mt-1">경기도 김포시 양촌읍 황금로 123 FLEX CENTER 물류센터 (내 브랜드명 / 내 전화번호 꼭 적어서 보내기!)</p><p className="text-[10px] opacity-40 mt-2">* 입고되면 카톡으로 알려드려요</p>
            </div>
            <button className="mt-6 bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold">입고 신청서 작성 (준비중)</button>
          </div>
        )}

        {tab==="outbound" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5"><h3 className="font-bold text-[14px]">내 주문 출고 내역</h3><p className="text-[11px] opacity-50 mt-1">네이버, 쿠팡에서 주문 들어오면 자동으로 우리 센터에서 출고돼요</p></div>
            <table className="w-full text-[12px]">
              <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b border-black/5"><tr><th className="text-left py-3 px-6">주문번호 / 상품</th><th className="text-center">수량</th><th className="text-center">상태</th><th className="text-center">송장번호</th></tr></thead>
              <tbody>
                {outbounds.map(o => (
                  <tr key={o.id} className="border-b border-black/[0.03]">
                    <td className="py-4 px-6"><p className="font-mono text-[11px]">{o.platform_order_id}</p><p className="font-bold text-[12px] mt-1">{o.product_name}</p><p className="text-[10px] opacity-40">{new Date(o.created_at).toLocaleString("ko-KR")}</p></td>
                    <td className="text-center">{o.qty || o.quantity}</td>
                    <td className="text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${o.status==="출고완료" || o.order_status==="shipped" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{o.status || o.order_status}</span></td>
                    <td className="text-center font-mono text-[11px]">{o.invoice || o.invoice_no || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}


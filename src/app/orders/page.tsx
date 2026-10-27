"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const mockOrders = [
  { id: "1", platform: "naver", platform_order_id: "20241027-001", order_status: "new", recipient_name: "김철수", recipient_phone: "010-1234-5678", recipient_address: "서울시 강남구 테헤란로 123", product_name: "무선 이어폰", quantity: 2, total_amount: 59000, sku: "EAR-001", rack_location: "A-01-02", invoice_no: "", created_at: new Date().toISOString() },
  { id: "2", platform: "coupang", platform_order_id: "C-20241027-002", order_status: "picking", recipient_name: "이영희", recipient_phone: "010-9876-5432", recipient_address: "경기도 김포시 김포대로 100", product_name: "스마트 워치", quantity: 1, total_amount: 129000, sku: "WATCH-02", rack_location: "B-02-05", invoice_no: "", created_at: new Date().toISOString() },
  { id: "3", platform: "11st", platform_order_id: "11-20241027-003", order_status: "packing", recipient_name: "박민수", recipient_phone: "010-5555-6666", recipient_address: "인천시 서구 청라동 200", product_name: "블루투스 스피커", quantity: 1, total_amount: 45000, sku: "SPK-03", rack_location: "A-03-01", invoice_no: "CJ1234567890", created_at: new Date().toISOString() },
];

export default function OrdersPage() {
  const [session, setSession] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>(mockOrders);
  const [filter, setFilter] = useState<"all" | "new" | "picking" | "packing" | "shipped">("all");
  const [platformFilter, setPlatformFilter] = useState<"all" | "naver" | "coupang" | "11st">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        try {
          const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
          if (data && data.length > 0) setOrders(data);
        } catch(e) {}
      }
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
  };

  const filtered = orders.filter(o => {
    if (filter !== "all" && o.order_status !== filter) return false;
    if (platformFilter !== "all" && o.platform !== platformFilter) return false;
    return true;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">주문관리 WMS</span></Link>
          <div className="flex gap-2"><Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full border">회원전용</Link><Link href="/platforms" className="text-[12px] px-4 py-2 rounded-full border">플랫폼 연동</Link></div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div><h1 className="text-[28px] font-bold tracking-tight">통합 주문 관리</h1><p className="text-[13px] opacity-60 mt-1">네이버, 쿠팡, 11번가 주문을 한 곳에서 관리하고 WMS로 풀필먼트합니다</p></div>
          <div className="text-[11px] opacity-50">총 {filtered.length}건 / {orders.length}건</div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <div className="flex gap-1 bg-white border border-black/5 rounded-full p-1">
            {(["all", "new", "picking", "packing", "shipped"] as const).map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-1.5 rounded-full text-[11px] font-semibold ${filter===f ? "bg-black text-white" : "opacity-60"}`}>{f === "all" ? "전체" : f === "new" ? "신규" : f === "picking" ? "피킹중" : f === "packing" ? "패킹중" : "출고완료"}</button>
            ))}
          </div>
          <div className="flex gap-1 bg-white border border-black/5 rounded-full p-1">
            {(["all", "naver", "coupang", "11st"] as const).map(f => (
              <button key={f} onClick={()=>setPlatformFilter(f as any)} className={`px-4 py-1.5 rounded-full text-[11px] font-semibold ${platformFilter===f ? "bg-black text-white" : "opacity-60"}`}>{f === "all" ? "전체 플랫폼" : f}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b border-black/5"><tr><th className="text-left py-3 px-4">플랫폼 / 주문번호</th><th className="text-left">상품</th><th className="text-left">수령인 / 주소</th><th className="text-center">상태</th><th className="text-center">선반</th><th className="text-center">액션</th></tr></thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-black/5 hover:bg-[#fafaf8]">
                    <td className="py-4 px-4"><div className="flex items-center gap-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${o.platform==="naver" ? "bg-green-100 text-green-700" : o.platform==="coupang" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{o.platform}</span><span className="font-mono text-[11px]">{o.platform_order_id}</span></div><div className="text-[10px] opacity-40 mt-1">{new Date(o.created_at).toLocaleString("ko-KR")}</div></td>
                    <td><p className="font-semibold">{o.product_name}</p><p className="text-[10px] opacity-50 font-mono">{o.sku} x {o.quantity} / {o.total_amount?.toLocaleString()}원</p></td>
                    <td><p className="font-semibold">{o.recipient_name}</p><p className="text-[10px] opacity-60">{o.recipient_address}</p><p className="text-[10px] opacity-40">{o.recipient_phone}</p></td>
                    <td className="text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${o.order_status==="new" ? "bg-amber-100 text-amber-800" : o.order_status==="picking" ? "bg-blue-100 text-blue-800" : o.order_status==="packing" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>{o.order_status}</span></td>
                    <td className="text-center font-mono text-[11px]">{o.rack_location}</td>
                    <td className="text-center">
                      <div className="flex flex-col gap-1">
                        {o.order_status==="new" && <button onClick={()=>updateStatus(o.id, "picking")} className="text-[10px] px-2 py-1 rounded-full bg-black text-white">피킹 시작</button>}
                        {o.order_status==="picking" && <button onClick={()=>updateStatus(o.id, "packing")} className="text-[10px] px-2 py-1 rounded-full bg-blue-500 text-white">패킹으로</button>}
                        {o.order_status==="packing" && <button onClick={()=>updateStatus(o.id, "shipped")} className="text-[10px] px-2 py-1 rounded-full bg-green-500 text-white">송장 출력 및 출고</button>}
                        {o.order_status==="shipped" && <span className="text-[10px] text-green-600 font-bold">출고완료 {o.invoice_no && `(${o.invoice_no})`}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length===0 && <div className="text-center py-12 text-[13px] opacity-40">해당 조건의 주문이 없습니다<br/><span className="text-[11px]">플랫폼 연동 후 주문이 수집되면 여기에 표시됩니다</span></div>}
        </div>

        <div className="mt-8 bg-black text-white rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">WMS 풀필먼트 흐름</h3>
          <div className="mt-4 grid md:grid-cols-4 gap-4 text-[11px] leading-relaxed opacity-80">
            <div><p className="font-bold text-white">1. 주문 수집</p><p>5분마다 네이버, 쿠팡 API에서 주문 자동 수집 - orders 테이블 저장</p></div>
            <div><p className="font-bold text-white">2. 피킹</p><p>선반 위치별(A-01-02)로 상품 모아서 피킹 리스트 생성 - 작업자 할당</p></div>
            <div><p className="font-bold text-white">3. 패킹 및 송장</p><p>합포장 3개 무료 체크, CJ대한통운 API로 송장 출력</p></div>
            <div><p className="font-bold text-white">4. 출고 및 업로드</p><p>출고 완료 후 플랫폼에 송장번호 자동 업로드 - 고객에게 배송 시작 알림</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}

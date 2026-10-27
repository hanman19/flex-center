"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from("seller_profiles").select("*").order("created_at", { ascending: false });
        if (data) setSellers(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (userId: string, status: string) => {
    const { error } = await supabase.from("seller_profiles").update({ status }).eq("user_id", userId);
    if (error) alert("에러: " + error.message);
    else {
      setSellers(sellers.map(s => s.user_id === userId ? { ...s, status } : s));
      alert(`${status}로 변경됨!`);
    }
  };

  const filtered = sellers.filter(s => filter === "all" ? true : s.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

  if (!session || session.user.email !== "phankyu@gmail.com") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8] p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[400px] w-full text-center">
          <h1 className="font-bold text-[18px]">관리자 전용</h1>
          <p className="text-[12px] opacity-60 mt-2">phankyu@gmail.com 계정만 접근 가능</p>
          <p className="text-[11px] opacity-40 mt-1">현재: {session?.user?.email || "로그인 안됨"}</p>
          <Link href="/login" className="mt-6 block w-full bg-black text-white rounded-full py-3 text-[13px]">로그인 →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">관리자</span><span className="ml-2 bg-amber-400 text-black px-2 py-0.5 rounded-full text-[10px] font-bold">ADMIN</span></Link>
          <div className="flex gap-2">
            <Link href="/admin/wms" className="text-[12px] px-5 py-2 rounded-full bg-black text-white font-bold">작업자 WMS →</Link>
            <Link href="/" className="text-[12px] px-4 py-2 rounded-full border">홈</Link>
            <Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full border">회원전용</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold">사업자 승인 관리</h1>
            <p className="text-[12px] opacity-60 mt-1">회원가입 신청한 사업자를 승인/거부합니다</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/wms" className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold flex items-center gap-2">🔧 작업자 WMS (김포센터 운영) →</Link>
            <Link href="/orders" className="border border-black/10 px-5 py-2.5 rounded-full text-[12px] font-bold">주문관리 →</Link>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-black text-white rounded-[16px] p-6">
            <h3 className="font-bold text-[14px]">운영 메뉴</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/admin/wms" className="bg-white text-black rounded-[12px] p-4 hover:bg-amber-300 transition"><p className="font-bold text-[13px]">작업자 WMS</p><p className="text-[10px] opacity-60 mt-1">김포센터 피킹, 패킹 작업자 전용</p><p className="text-[11px] font-bold mt-2">바로가기 →</p></Link>
              <Link href="/orders" className="bg-white/10 border border-white/20 rounded-[12px] p-4 hover:bg-white/20 transition"><p className="font-bold text-[13px]">주문관리</p><p className="text-[10px] opacity-60 mt-1">통합 주문 및 송장 관리</p><p className="text-[11px] font-bold mt-2">바로가기 →</p></Link>
              <Link href="/wms" className="bg-white/10 border border-white/20 rounded-[12px] p-4 hover:bg-white/20 transition"><p className="font-bold text-[13px]">셀러 WMS (내 창고)</p><p className="text-[10px] opacity-60 mt-1">셀러가 보는 내 창고 뷰</p><p className="text-[11px] font-bold mt-2">바로가기 →</p></Link>
              <Link href="/platforms" className="bg-white/10 border border-white/20 rounded-[12px] p-4 hover:bg-white/20 transition"><p className="font-bold text-[13px]">플랫폼 연동</p><p className="text-[10px] opacity-60 mt-1">네이버, 쿠팡 API 연동</p><p className="text-[11px] font-bold mt-2">바로가기 →</p></Link>
            </div>
          </div>
          <div className="bg-white border border-black/5 rounded-[16px] p-6">
            <h3 className="font-bold text-[14px]">승인 현황</h3>
            <div className="mt-4 flex gap-3">
              <div className="flex-1 bg-amber-50 border border-amber-200 rounded-[12px] p-3 text-center"><p className="text-[10px] opacity-60">PENDING</p><p className="text-[20px] font-bold text-amber-800">{sellers.filter(s=>s.status==="pending").length}</p></div>
              <div className="flex-1 bg-green-50 border border-green-200 rounded-[12px] p-3 text-center"><p className="text-[10px] opacity-60">APPROVED</p><p className="text-[20px] font-bold text-green-800">{sellers.filter(s=>s.status==="approved").length}</p></div>
              <div className="flex-1 bg-black/5 rounded-[12px] p-3 text-center"><p className="text-[10px] opacity-60">TOTAL</p><p className="text-[20px] font-bold">{sellers.length}</p></div>
            </div>
            <div className="mt-4 flex gap-1 bg-[#fafaf8] border border-black/5 rounded-full p-1">
              {(["all", "pending", "approved"] as const).map(f => (
                <button key={f} onClick={()=>setFilter(f)} className={`flex-1 py-2 rounded-full text-[11px] font-bold ${filter===f ? "bg-black text-white" : "opacity-60"}`}>{f.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5"><h3 className="font-bold text-[14px]">사업자 목록 ({filtered.length})</h3></div>
          <div className="divide-y divide-black/5">
            {filtered.map(s => (
              <div key={s.user_id} className="px-6 py-4 flex items-center justify-between hover:bg-[#fafaf8]">
                <div className="flex-1">
                  <div className="flex items-center gap-2"><p className="font-bold text-[13px]">{s.company_name || "상호 없음"}</p><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.status==="pending" ? "bg-amber-100 text-amber-800" : s.status==="approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{s.status}</span></div>
                  <p className="text-[11px] opacity-60 mt-1">{s.business_no} | {s.ceo_name} | {s.business_address}</p><p className="text-[10px] opacity-40 font-mono">{s.user_id.slice(0,8)}... | {new Date(s.created_at).toLocaleString("ko-KR")}</p>
                </div>
                <div className="flex gap-1">
                  {s.status==="pending" && <><button onClick={()=>updateStatus(s.user_id, "approved")} className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[11px] font-bold">승인</button><button onClick={()=>updateStatus(s.user_id, "rejected")} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[11px] font-bold">거부</button></>}
                  {s.status==="approved" && <button onClick={()=>updateStatus(s.user_id, "pending")} className="border border-black/10 px-3 py-1.5 rounded-full text-[11px]">대기로</button>}
                  {s.status==="rejected" && <button onClick={()=>updateStatus(s.user_id, "pending")} className="border border-black/10 px-3 py-1.5 rounded-full text-[11px]">재검토</button>}
                </div>
              </div>
            ))}
            {filtered.length===0 && <div className="text-center py-12 text-[13px] opacity-40">해당 상태의 사업자가 없습니다</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

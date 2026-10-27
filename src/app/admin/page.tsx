"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function AdminPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const fetchData = async () => {
    setLoading(true);
    const { data: sellersData } = await supabase.from("seller_profiles").select("*").order("created_at", { ascending: false });
    const { data: itemsData } = await supabase.from("items").select("*").order("created_at", { ascending: false });
    if (sellersData) setSellers(sellersData);
    if (itemsData) setItems(itemsData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (userId: string, status: "approved" | "rejected") => {
    if (!confirm(`정말 ${status === "approved" ? "승인" : "거부"} 하시겠습니까?`)) return;
    const { error } = await supabase.from("seller_profiles").update({ status }).eq("user_id", userId);
    if (error) alert("에러: " + error.message);
    else { alert(`${status} 완료!`); fetchData(); }
  };

  const filtered = sellers.filter(s => filter === "all" ? true : s.status === filter);
  const pendingCount = sellers.filter(s => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-tight">FLEX CENTER ADMIN</h1>
          <div className="flex gap-2">
            <a href="/" className="text-[12px] px-4 py-2 rounded-full bg-white/10">홈으로</a>
            <a href="/dashboard" className="text-[12px] px-4 py-2 rounded-full bg-white text-black font-semibold">회원전용</a>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
          <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-4">
            <p className="text-[11px] opacity-50">TOTAL ITEMS</p><p className="text-[24px] font-bold mt-1">{items.length}</p>
          </div>
          <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-4">
            <p className="text-[11px] opacity-50">TOTAL SELLERS</p><p className="text-[24px] font-bold mt-1">{sellers.length}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-[16px] p-4">
            <p className="text-[11px] text-amber-300">PENDING</p><p className="text-[24px] font-bold mt-1 text-amber-300">{pendingCount}</p>
          </div>
          <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-4">
            <p className="text-[11px] opacity-50">TODAY</p><p className="text-[24px] font-bold mt-1">{items.filter(i => new Date(i.created_at).toDateString() === new Date().toDateString()).length}</p>
          </div>
          <div className="bg-white/[0.06] border border-white/10 rounded-[16px] p-4">
            <p className="text-[11px] opacity-50">CUBES</p><p className="text-[24px] font-bold mt-1">23/30</p>
          </div>
        </div>

        {/* SELLER APPROVAL */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">사업자 승인 관리 {pendingCount > 0 && <span className="ml-2 bg-amber-500 text-black text-[11px] px-2 py-0.5 rounded-full">{pendingCount} 대기</span>}</h2>
            <div className="flex gap-1 bg-white/10 rounded-full p-1">
              {(["pending", "approved", "all"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-[11px] font-semibold ${filter===f ? "bg-white text-black" : "text-white/60"}`}>{f.toUpperCase()}</button>
              ))}
            </div>
          </div>

          {loading ? <p className="mt-6 opacity-50 text-[13px]">로딩 중...</p> : filtered.length === 0 ? <p className="mt-6 opacity-30 text-[13px]">해당 상태의 사업자가 없습니다.</p> :
            <div className="mt-4 space-y-3">
              {filtered.map(s => (
                <div key={s.user_id} className={`border rounded-[16px] p-5 ${s.status === "pending" ? "bg-amber-500/5 border-amber-500/20" : s.status === "approved" ? "bg-green-500/5 border-green-500/20" : "bg-white/[0.03] border-white/10"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold">{s.company_name || "상호 미입력"}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.status==="pending"?"bg-amber-500 text-black": s.status==="approved"?"bg-green-500 text-black":"bg-red-500 text-white"}`}>{s.status?.toUpperCase()}</span>
                        <span className="text-[11px] opacity-50">{new Date(s.created_at).toLocaleString("ko-KR")}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
                        <div><p className="opacity-40 text-[10px]">사업자번호</p><p className="font-mono">{s.business_no}</p></div>
                        <div><p className="opacity-40 text-[10px]">대표자</p><p>{s.ceo_name}</p></div>
                        <div><p className="opacity-40 text-[10px]">사업자유형</p><p>{s.business_type}</p></div>
                        <div><p className="opacity-40 text-[10px]">개업일</p><p>{s.opening_date}</p></div>
                        <div className="col-span-2"><p className="opacity-40 text-[10px]">사업장 주소</p><p>{s.business_address}</p></div>
                        <div><p className="opacity-40 text-[10px]">정산</p><p>{s.bank_name} {s.account_no} ({s.account_holder})</p></div>
                        <div><p className="opacity-40 text-[10px]">세금 이메일</p><p>{s.tax_email}</p></div>
                        <div><p className="opacity-40 text-[10px]">SKU / 월 주문</p><p>{s.sku_count} / {s.monthly_orders}</p></div>
                        <div><p className="opacity-40 text-[10px]">보관 유형</p><p>{s.storage_type}</p></div>
                        <div><p className="opacity-40 text-[10px]">판매 채널</p><p>{(s.sales_channels||[]).join(", ")}</p></div>
                        <div className="col-span-2"><p className="opacity-40 text-[10px]">특이사항</p><p>{s.special_note || "-"}</p></div>
                        <div><p className="opacity-40 text-[10px]">USER ID</p><p className="font-mono text-[10px] opacity-60">{s.user_id}</p></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {s.status === "pending" && <>
                        <button onClick={() => updateStatus(s.user_id, "approved")} className="px-5 py-2 rounded-full bg-white text-black text-[12px] font-bold hover:bg-white/90">✅ 승인</button>
                        <button onClick={() => updateStatus(s.user_id, "rejected")} className="px-5 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[12px] font-bold">❌ 거부</button>
                      </>}
                      {s.status === "approved" && <button onClick={() => updateStatus(s.user_id, "rejected")} className="px-5 py-2 rounded-full bg-white/10 text-[11px]">승인 취소</button>}
                      {s.status === "rejected" && <button onClick={() => updateStatus(s.user_id, "approved")} className="px-5 py-2 rounded-full bg-white/10 text-[11px]">재승인</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {/* ITEMS LOG */}
        <div className="mt-12">
          <h2 className="text-[16px] font-bold opacity-60">최근 입고 ITEMS (MY STATS)</h2>
          <div className="mt-3 bg-white/[0.03] border border-white/10 rounded-[16px] overflow-hidden">
            <div className="max-h-[300px] overflow-auto">
              {items.slice(0, 20).map((it, i) => (
                <div key={it.id || i} className="flex justify-between px-4 py-2 border-b border-white/5 text-[11px] font-mono">
                  <span className="opacity-60">{new Date(it.created_at).toLocaleString("ko-KR")}</span>
                  <span className="opacity-80">{it.name || it.title || "무제"}</span>
                  <span className="opacity-40">{(it.user_id||"").slice(0,8)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

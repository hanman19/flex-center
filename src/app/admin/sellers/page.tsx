"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function AdminSellersPage() {
  const [mounted, setMounted] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      const { data } = await supabase.from("seller_profiles").select("*").limit(50);
      if (data) setSellers(data);
      else setSellers([
        { id: "1", email: "phankyu@gmail.com", business_name: "Flex Center", role: "admin" },
        { id: "2", email: "brandA@example.com", business_name: "브랜드A", role: "seller" },
      ]);
    };
    load();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">셀러 관리</h1>
        <p className="text-[13px] opacity-60 mt-1">seller_profiles 테이블! role 변경 가능!</p>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">이메일 / 사업자명 / 역할</th><th className="text-center">역할 변경</th><th className="text-center">상태</th></tr></thead>
            <tbody>{sellers.map((s:any)=><tr key={s.id} className="border-b"><td className="py-4 px-6"><p className="font-bold">{s.email}</p><p className="text-[11px] opacity-50">{s.business_name || s.company_name || "-"} / role: {s.role || "seller"}</p></td><td className="text-center"><div className="flex gap-1 justify-center"><button onClick={async()=>{ await supabase.from("seller_profiles").update({ role: "seller" }).eq("id", s.id); setSellers(sellers.map(x=>x.id===s.id?{...x, role:"seller"}:x)); }} className="bg-white border px-2 py-1 rounded-full text-[10px]">seller</button><button onClick={async()=>{ await supabase.from("seller_profiles").update({ role: "staff" }).eq("id", s.id); setSellers(sellers.map(x=>x.id===s.id?{...x, role:"staff"}:x)); }} className="bg-white border px-2 py-1 rounded-full text-[10px]">staff</button><button onClick={async()=>{ await supabase.from("seller_profiles").update({ role: "admin" }).eq("id", s.id); setSellers(sellers.map(x=>x.id===s.id?{...x, role:"admin"}:x)); }} className="bg-black text-white px-2 py-1 rounded-full text-[10px]">admin</button></div></td><td className="text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.role==="admin" ? "bg-black text-white" : s.role==="staff" ? "bg-[#FFC61A] text-black" : "bg-gray-100"}`}>{s.role || "seller"}</span></td></tr>)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

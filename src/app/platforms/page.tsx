"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const PLATFORMS = [
  { id: "naver", name: "네이버 스마트스토어", icon: "🟢", color: "bg-green-500", docs: "https://commerce.naver.com", fields: ["client_id", "client_secret"] },
  { id: "coupang", name: "쿠팡 WING", icon: "🚀", color: "bg-red-500", docs: "https://wing.coupang.com", fields: ["vendor_id", "access_key", "secret_key"] },
  { id: "11st", name: "11번가", icon: "🔴", color: "bg-red-600", docs: "https://api.11st.co.kr", fields: ["api_key"] },
  { id: "gmarket", name: "G마켓", icon: "🟡", color: "bg-yellow-500", docs: "https://www.esmplus.com", fields: ["api_key", "secret_key"] },
  { id: "auction", name: "옥션", icon: "🔵", color: "bg-blue-500", docs: "https://www.esmplus.com", fields: ["api_key"] },
  { id: "interpark", name: "인터파크", icon: "🟣", color: "bg-purple-500", docs: "https://seller.interpark.com", fields: ["api_key"] },
];

export default function PlatformsPage() {
  const [session, setSession] = useState<any>(null);
  const [connected, setConnected] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [formData, setFormData] = useState<{[k:string]: string}>({});

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from("seller_platforms").select("*").eq("user_id", s.user.id);
        if (data) setConnected(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleConnect = async (platformId: string) => {
    if (!session) return alert("로그인 필요!");
    const platform = PLATFORMS.find(p=>p.id===platformId);
    const missing = platform?.fields.filter(f=>!formData[f]);
    if (missing && missing.length>0) return alert(`${missing.join(", ")}를 입력하세요!`);

    const { error } = await supabase.from("seller_platforms").upsert({
      user_id: session.user.id,
      platform: platformId,
      api_key: formData.client_id || formData.vendor_id || formData.api_key || "",
      secret_key: formData.client_secret || formData.secret_key || formData.access_key || "",
      access_token: JSON.stringify(formData),
      connected: true,
    }, { onConflict: "user_id,platform" });

    if (error) alert("에러: " + error.message);
    else {
      alert(`${platform?.name} 연동 완료! (테스트 모드)`);
      setSelected(null);
      setFormData({});
      const { data } = await supabase.from("seller_platforms").select("*").eq("user_id", session.user.id);
      if (data) setConnected(data);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">
      <TopNav />로딩 중...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border rounded-[24px] p-8 max-w-[400px] w-full text-center">
          <h1 className="font-bold">로그인 필요</h1><p className="text-[12px] opacity-60 mt-2">플랫폼 연동은 로그인 후 가능합니다</p>
          <Link href="/login" className="mt-6 block w-full bg-black text-white rounded-full py-3 text-[13px]">로그인 →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">플랫폼 연동</span></Link>
          <div className="flex gap-2"><Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full border">회원전용</Link><Link href="/orders" className="text-[12px] px-4 py-2 rounded-full bg-black text-white">주문관리 →</Link></div>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-10">
        <h1 className="text-[28px] font-bold tracking-tight">판매 플랫폼 연동</h1>
        <p className="text-[13px] opacity-60 mt-2">네이버, 쿠팡, 11번가 등 판매 플랫폼의 API를 연동하면 주문을 자동으로 가져올 수 있습니다.</p>

        {connected.length > 0 && (
          <div className="mt-8 bg-white border border-black/5 rounded-[16px] p-6">
            <h2 className="text-[14px] font-bold">연동된 플랫폼 ({connected.length})</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {connected.map(c => {
                const p = PLATFORMS.find(x=>x.id===c.platform);
                return <div key={c.id} className="flex items-center gap-2 border border-black/10 rounded-full px-4 py-2 text-[12px]"><span>{p?.icon}</span><span className="font-semibold">{p?.name}</span><span className="text-[10px] opacity-50">연동됨</span></div>;
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {PLATFORMS.map(p => {
            const isConnected = connected.some(c=>c.platform===p.id);
            const isSelected = selected===p.id;
            return (
              <div key={p.id} className={`bg-white border rounded-[16px] p-6 ${isSelected ? "border-black ring-1 ring-black" : "border-black/5"} ${isConnected ? "bg-green-50/50" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${p.color} rounded-[10px] flex items-center justify-center text-white text-[18px]`}>{p.icon}</div>
                    <div><p className="font-bold text-[14px]">{p.name}</p><p className="text-[11px] opacity-50">{p.docs}</p></div>
                  </div>
                  {isConnected ? <span className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-full font-bold">연동됨</span> : <span className="text-[10px] bg-black/5 px-2 py-1 rounded-full">미연동</span>}
                </div>

                {!isSelected ? (
                  <button onClick={()=>setSelected(p.id)} className="mt-5 w-full border border-black/10 rounded-full py-2.5 text-[12px] font-semibold hover:bg-black hover:text-white transition">
                    {isConnected ? "API 키 수정" : "연동하기 →"}
                  </button>
                ) : (
                  <div className="mt-5 space-y-3">
                    {p.fields.map(field => (
                      <div key={field}>
                        <label className="text-[10px] font-bold opacity-60 uppercase">{field}</label>
                        <input value={formData[field]||""} onChange={e=>setFormData({...formData, [field]: e.target.value})} placeholder={field} className="mt-1 w-full border border-black/10 rounded-[10px] px-3 py-2.5 text-[12px] font-mono" />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button onClick={()=>{setSelected(null); setFormData({});}} className="flex-1 border rounded-full py-2.5 text-[12px]">취소</button>
                      <button onClick={()=>handleConnect(p.id)} className="flex-1 bg-black text-white rounded-full py-2.5 text-[12px] font-bold">연동 테스트 및 저장 →</button>
                    </div>
                    <p className="text-[10px] opacity-40 leading-relaxed">* 현재는 테스트 모드입니다. 실제 API 연동은 API 키 발급 후 서버에서 크론으로 주문을 수집합니다.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 bg-black text-white rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">연동 방법</h3>
          <div className="mt-4 space-y-3 text-[11px] leading-relaxed opacity-80">
            <p><b>네이버 스마트스토어:</b> 커머스 API 센터에서 Client ID/Secret 발급 - commerce.naver.com - 판매자센터 - API</p>
            <p><b>쿠팡 WING:</b> WING - 판매자 정보 - API 키 발급 (Vendor ID, Access Key, Secret Key)</p>
            <p><b>11번가:</b> 11번가 셀러오피스 - API 관리에서 발급</p>
            <p className="text-amber-300">실제 주문 수집은 서버 크론 작업이 필요합니다. 현재는 연동 정보만 저장하고, /orders에서 테스트 주문으로 UI를 먼저 만듭니다.</p>
          </div>
          <div className="mt-6 flex gap-2">
            <Link href="/orders" className="px-5 py-2.5 rounded-full bg-white text-black text-[12px] font-bold">다음: 주문 관리 보기 →</Link>
            <Link href="/" className="px-5 py-2.5 rounded-full bg-white/10 text-[12px]">홈으로</Link>
          </div>
        </div>
      </main>
    </div>
  );
}


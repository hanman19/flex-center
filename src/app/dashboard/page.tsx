"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", sku: "", quantity: "", location: "" });
  const [activeTab, setActiveTab] = useState<"stats" | "items" | "orders" | "platforms">("stats");

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data: prof } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).single();
        setProfile(prof);
        // items, orders, platforms 로드 (관리자는 전체, 일반 유저는 본인 것만)
        const isAdmin = s.user.email === "phankyu@gmail.com";
        let itemsQuery = supabase.from("items").select("*").order("created_at", { ascending: false });
        if (!isAdmin) itemsQuery = itemsQuery.eq("user_id", s.user.id);
        const { data: itemsData } = await itemsQuery;
        if (itemsData) setItems(itemsData);

        // orders (있으면)
        try {
          let ordersQuery = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20);
          if (!isAdmin) ordersQuery = ordersQuery.eq("user_id", s.user.id);
          const { data: ordersData } = await ordersQuery;
          if (ordersData) setOrders(ordersData);
        } catch(e) {}

        // platforms
        try {
          const { data: platData } = await supabase.from("seller_platforms").select("*").eq("user_id", s.user.id);
          if (platData) setPlatforms(platData);
        } catch(e) {}
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name) return alert("상품명 필수!");
    const { data: { session: s } } = await supabase.auth.getSession();
    const { error } = await supabase.from("items").insert({
      user_id: s?.user.id,
      name: newItem.name,
      sku: newItem.sku,
      quantity: parseInt(newItem.quantity) || 1,
      location: newItem.location,
    });
    if (error) alert(error.message);
    else {
      alert("상품 등록 완료!");
      setNewItem({ name: "", sku: "", quantity: "", location: "" });
      const { data } = await supabase.from("items").select("*").order("created_at", { ascending: false });
      if (data) setItems(data);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from("items").delete().eq("id", id);
    setItems(items.filter(i=>i.id!==id));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center">
          <h1 className="text-[22px] font-bold">회원전용 페이지입니다</h1>
          <p className="text-[13px] opacity-60 mt-2">로그인 후 이용 가능</p>
          <Link href="/login" className="mt-6 block w-full bg-black text-white rounded-full py-3.5 text-[13px]">로그인 →</Link>
        </div>
      </div>
    );
  }

  const isAdmin = session.user.email === "phankyu@gmail.com";

  if (!profile && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border rounded-[24px] p-8 max-w-[440px] w-full text-center">
          <h1 className="text-[22px] font-bold">사업자 인증이 필요합니다</h1>
          <Link href="/onboarding" className="mt-6 block w-full bg-black text-white rounded-full py-3.5 text-[13px]">사업자 인증하러 가기 →</Link>
        </div>
      </div>
    );
  }

  if (profile?.status === "pending" && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border rounded-[24px] p-8 max-w-[440px] w-full text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">⏳</div>
          <h1 className="text-[22px] font-bold mt-5">승인 대기 중입니다</h1>
          <p className="text-[13px] opacity-60 mt-3">{profile.company_name} · 관리자 검토 중</p>
          <div className="mt-6 flex gap-2"><Link href="/" className="flex-1 border rounded-full py-3 text-[12px]">홈으로</Link><button onClick={async()=>{await supabase.auth.signOut(); location.href="/";}} className="flex-1 bg-black text-white rounded-full py-3 text-[12px]">로그아웃</button></div>
        </div>
      </div>
    );
  }

  // APPROVED or ADMIN - FULL DASHBOARD
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1300px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span></Link>
            <span className="text-[11px] opacity-40">|</span>
            <span className="text-[12px] font-semibold">{isAdmin ? "관리자 👑" : `${profile?.company_name || "회원"} · 승인됨 ✅`}</span>
            <span className="text-[10px] opacity-40 hidden md:block">{isAdmin ? "phankyu@gmail.com" : `${profile?.business_no} · ${profile?.ceo_name}`}</span>
          </div>
          <div className="flex gap-2">
            <Link href="/platforms" className="text-[11px] px-3 py-2 rounded-full border">플랫폼 연동</Link>
            <Link href="/orders" className="text-[11px] px-3 py-2 rounded-full border">주문관리</Link>
            <Link href="/pricing" className="text-[11px] px-3 py-2 rounded-full border">요금제</Link>
            {isAdmin && <Link href="/admin" className="text-[11px] px-3 py-2 rounded-full bg-amber-500 text-black font-bold">ADMIN</Link>}
            <Link href="/" className="text-[11px] px-3 py-2 rounded-full border">홈</Link>
            <button onClick={async()=>{await supabase.auth.signOut(); location.href="/";}} className="text-[11px] px-4 py-2 rounded-full bg-black text-white">로그아웃</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1300px] mx-auto px-6 py-8">
        {/* TABS */}
        <div className="flex gap-2 mb-8 bg-white border border-black/5 rounded-full p-1.5 w-fit">
          {[
            { id: "stats", label: "MY STATS" },
            { id: "items", label: `재고 관리 (${items.length})` },
            { id: "orders", label: `주문 관리 (${orders.length})` },
            { id: "platforms", label: `플랫폼 연동 (${platforms.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id as any)} className={`px-5 py-2 rounded-full text-[12px] font-semibold transition ${activeTab===tab.id ? "bg-black text-white" : "opacity-60 hover:opacity-100"}`}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "stats" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[10px] opacity-50 font-bold">TOTAL ITEMS</p><p className="text-[24px] font-bold mt-1">{items.length}</p><p className="text-[10px] opacity-40 mt-1">등록된 상품</p></div>
              <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[10px] opacity-50 font-bold">TODAY INBOUND</p><p className="text-[24px] font-bold mt-1">{items.filter(i=>new Date(i.created_at).toDateString()===new Date().toDateString()).length}</p><p className="text-[10px] opacity-40 mt-1">오늘 입고</p></div>
              <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[10px] opacity-50 font-bold">CUBES</p><p className="text-[24px] font-bold mt-1">23/30</p><p className="text-[10px] opacity-40 mt-1">선반 사용량</p></div>
              <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[10px] opacity-50 font-bold">ORDERS</p><p className="text-[24px] font-bold mt-1">{orders.length}</p><p className="text-[10px] opacity-40 mt-1">수집된 주문</p></div>
              <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[10px] opacity-60 font-bold">PLAN</p><p className="text-[14px] font-bold mt-1">{profile?.plan || "LITE"}</p><p className="text-[10px] opacity-60 mt-1">{profile?.company_name || "플랜"}</p></div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-black/5 rounded-[20px] p-6">
                <h3 className="font-bold text-[14px]">🎉 승인이 완료되었습니다!</h3>
                <p className="text-[12px] opacity-60 mt-2 leading-relaxed">이제 상품을 등록하고, 플랫폼을 연동하여 주문을 자동으로 받을 수 있습니다. 다음 단계를 진행하세요.</p>
                <div className="mt-5 space-y-2">
                  <Link href="/platforms" className="flex items-center justify-between border border-black/10 rounded-[12px] px-4 py-3 text-[12px] hover:bg-black hover:text-white transition"><span>1. 판매 플랫폼 연동하기 (네이버, 쿠팡)</span><span>→</span></Link>
                  <button onClick={()=>setActiveTab("items")} className="flex w-full items-center justify-between border border-black/10 rounded-[12px] px-4 py-3 text-[12px] hover:bg-black hover:text-white transition"><span>2. 상품 등록하기 (MY STATS)</span><span>→</span></button>
                  <Link href="/orders" className="flex items-center justify-between border border-black/10 rounded-[12px] px-4 py-3 text-[12px] hover:bg-black hover:text-white transition"><span>3. 주문 관리 및 WMS 풀필먼트</span><span>→</span></Link>
                </div>
              </div>
              <div className="bg-white border border-black/5 rounded-[20px] p-6">
                <h3 className="font-bold text-[14px]">최근 활동 로그</h3>
                <div className="mt-4 space-y-2 max-h-[200px] overflow-auto">
                  {items.slice(0, 10).map((it, i) => (
                    <div key={it.id || i} className="flex justify-between text-[11px] border-b border-black/5 py-2"><span className="opacity-60">{new Date(it.created_at).toLocaleString("ko-KR")}</span><span className="font-semibold">{it.name || it.title}</span><span className="opacity-40 font-mono">{(it.sku||"").slice(0,10)}</span></div>
                  ))}
                  {items.length===0 && <p className="text-[11px] opacity-30">아직 활동이 없습니다. 상품을 등록해보세요.</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "items" && (
          <div className="bg-white border border-black/5 rounded-[20px] p-6">
            <h2 className="text-[16px] font-bold">재고 관리 (MY STATS)</h2>
            <p className="text-[11px] opacity-50 mt-1">상품을 등록하면 김포 센터 선반에 보관됩니다</p>
            
            <div className="mt-6 grid md:grid-cols-5 gap-3 bg-[#fafaf8] border border-black/5 rounded-[12px] p-4">
              <input placeholder="상품명 *" value={newItem.name} onChange={e=>setNewItem({...newItem, name:e.target.value})} className="border border-black/10 rounded-[10px] px-3 py-2.5 text-[12px]" />
              <input placeholder="SKU (바코드)" value={newItem.sku} onChange={e=>setNewItem({...newItem, sku:e.target.value})} className="border border-black/10 rounded-[10px] px-3 py-2.5 text-[12px]" />
              <input placeholder="수량" type="number" value={newItem.quantity} onChange={e=>setNewItem({...newItem, quantity:e.target.value})} className="border border-black/10 rounded-[10px] px-3 py-2.5 text-[12px]" />
              <input placeholder="선반 위치 (예: A-01-02)" value={newItem.location} onChange={e=>setNewItem({...newItem, location:e.target.value})} className="border border-black/10 rounded-[10px] px-3 py-2.5 text-[12px]" />
              <button onClick={handleAddItem} className="bg-black text-white rounded-[10px] py-2.5 text-[12px] font-bold">상품 등록 +</button>
            </div>

            <div className="mt-6 overflow-auto">
              <table className="w-full text-[12px]">
                <thead className="text-[10px] opacity-50 border-b border-black/10"><tr><th className="text-left py-2 px-2">상품명</th><th className="text-left">SKU</th><th>수량</th><th>선반 위치</th><th>등록일</th><th></th></tr></thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id} className="border-b border-black/5 hover:bg-[#fafaf8]">
                      <td className="py-3 px-2 font-semibold">{it.name || it.title}</td>
                      <td className="font-mono text-[11px] opacity-60">{it.sku || "-"}</td>
                      <td className="text-center">{it.quantity || 1}</td>
                      <td className="text-center font-mono text-[11px]">{it.location || "미지정"}</td>
                      <td className="text-center text-[11px] opacity-50">{new Date(it.created_at).toLocaleDateString()}</td>
                      <td className="text-center"><button onClick={()=>handleDeleteItem(it.id)} className="text-[10px] text-red-500 border border-red-200 rounded-full px-2 py-1">삭제</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length===0 && <p className="text-center py-10 text-[12px] opacity-30">등록된 상품이 없습니다. 위에서 상품을 등록해보세요!</p>}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white border border-black/5 rounded-[20px] p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold">주문 관리 (WMS)</h2>
              <Link href="/orders" className="text-[11px] px-4 py-2 rounded-full bg-black text-white">전체 주문 페이지 →</Link>
            </div>
            <p className="text-[11px] opacity-50 mt-1">네이버, 쿠팡 등에서 수집된 주문을 WMS로 처리합니다</p>
            {orders.length===0 ? (
              <div className="mt-8 text-center py-12 border border-dashed border-black/10 rounded-[16px]">
                <p className="text-[13px] font-bold">아직 수집된 주문이 없습니다</p>
                <p className="text-[11px] opacity-50 mt-2">/platforms에서 플랫폼을 연동하면 주문이 자동으로 수집됩니다</p>
                <Link href="/platforms" className="mt-4 inline-block px-5 py-2 rounded-full bg-black text-white text-[11px]">플랫폼 연동하러 가기 →</Link>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                {orders.map((o:any) => (
                  <div key={o.id} className="flex justify-between items-center border border-black/5 rounded-[12px] px-4 py-3 text-[12px]">
                    <span className="font-mono text-[11px]">{o.platform_order_id || o.id.slice(0,8)}</span>
                    <span>{o.product_name || "상품명"}</span>
                    <span className="text-[11px] opacity-60">{o.recipient_name}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${o.order_status==="new"?"bg-amber-100 text-amber-800": o.order_status==="shipped"?"bg-green-100 text-green-800":"bg-black/5"}`}>{o.order_status || "new"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "platforms" && (
          <div className="bg-white border border-black/5 rounded-[20px] p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[16px] font-bold">플랫폼 연동</h2>
              <Link href="/platforms" className="text-[11px] px-4 py-2 rounded-full bg-black text-white">연동 페이지 →</Link>
            </div>
            {platforms.length===0 ? (
              <div className="mt-6 text-center py-10 border border-dashed rounded-[16px]">
                <p className="text-[13px] font-bold">연동된 플랫폼이 없습니다</p>
                <p className="text-[11px] opacity-50 mt-1">네이버, 쿠팡 등을 연동해보세요</p>
                <Link href="/platforms" className="mt-4 inline-block px-5 py-2 rounded-full bg-black text-white text-[11px]">플랫폼 연동 →</Link>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {platforms.map((p:any) => <div key={p.id} className="border border-black/10 rounded-full px-4 py-2 text-[12px]"><span className="font-bold">{p.platform}</span> <span className="text-[10px] opacity-50">연동됨 ✅</span></div>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

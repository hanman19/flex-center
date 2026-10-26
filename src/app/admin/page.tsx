"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = "https://qkpnvfmsmvcemdblaahl.supabase.co";
const supabaseKey = "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF";
const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAILS = ["phankyu@gmail.com", "hanman1982@gmail.com", "hanman19@gmail.com"];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total:0, today:0, cubes:22 });

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>{
      setUser(data.session?.user ?? null);
    });
  }, []);

  async function fetchAll() {
    setLoading(true);
    // For admin we need to bypass RLS via a special policy, but for now we try to fetch all
    // If RLS blocks, we will show a guide to add admin policy
    const { data: itemsData, error } = await supabase.from("items").select("*").order("created_at", {ascending:false});
    if (error) {
      console.log("RLS error", error);
    } else if (itemsData) {
      setItems(itemsData);
      const today = new Date().toISOString().slice(0,10);
      const todayCount = itemsData.filter((i:any)=> i.created_at?.startsWith(today)).length;
      setStats({ total: itemsData.length, today: todayCount, cubes: 22 + itemsData.length });
      // group by user_id
      const grouped: any = {};
      itemsData.forEach((it:any)=>{
        const key = it.user_id || "unknown";
        if (!grouped[key]) grouped[key] = { user_id:key, seller_names: new Set(), count:0, last: it.created_at, email_hint: it.seller_name };
        grouped[key].count++;
        grouped[key].seller_names.add(it.seller_name);
        grouped[key].last = it.created_at;
      });
      setUsers(Object.values(grouped).map((g:any)=> ({...g, seller_names: Array.from(g.seller_names).join(", ")})));
    }
    setLoading(false);
  }

  useEffect(()=>{ if(user) fetchAll(); }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center p-8">
        <div className="bg-white border rounded-[24px] p-8 max-w-[420px] w-full text-center">
          <p className="font-black text-[20px]">사장님 전용 페이지</p>
          <p className="text-[13px] opacity-60 mt-2">로그인이 필요합니다. /dashboard에서 로그인 후 다시 오세요.</p>
          <Link href="/dashboard" className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold">로그인하러 가기 →</Link>
        </div>
      </div>
    );
  }

  const isAdmin = ADMIN_EMAILS.includes(user.email);
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center p-8">
        <div className="bg-white border rounded-[24px] p-8 max-w-[520px] w-full">
          <p className="font-black text-[18px]">접근 권한 없음</p>
          <p className="text-[13px] opacity-60 mt-2">현재 로그인: {user.email}</p>
          <p className="text-[13px] opacity-60 mt-1">사장님 전용 페이지는 {ADMIN_EMAILS.join(", ")} 만 볼 수 있어요. Supabase Authentication에서 내 이메일을 저 리스트에 추가하거나, 아래 SQL로 관리자 정책을 추가하세요.</p>
          <div className="bg-black text-white rounded-xl p-4 mt-4 text-[11px] font-mono overflow-auto">
            create policy "Admin can view all" on items for select using (auth.email() in ('phankyu@gmail.com'));<br/>
            -- 또는 RLS 잠시 끄고 테스트: alter table items disable row level security;
          </div>
          <Link href="/dashboard" className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold">내 창고로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#111]">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-lg">F</div>
            <span className="font-black">FLEX CENTER</span>
            <span className="text-[10px] tracking-widest opacity-40 border px-2 py-1 rounded-full ml-2">ADMIN • {user.email}</span>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="text-[12px] border px-4 py-2 rounded-full">홈</Link>
            <Link href="/dashboard" className="text-[12px] border px-4 py-2 rounded-full">내 창고</Link>
            <button onClick={()=>supabase.auth.signOut().then(()=>location.href="/")} className="text-[12px] bg-black text-white px-4 py-2 rounded-full">로그아웃</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-8 py-10">
        <h1 className="text-[40px] font-black tracking-tight leading-none">사장님 대시보드</h1>
        <p className="text-[14px] opacity-60 mt-3">전체 큐브 현황 • 전체 셀러 입고 • 매출 관리 (추후 결제 연동)</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-black text-white rounded-[20px] p-6">
            <p className="text-[11px] opacity-50 tracking-widest">TOTAL ITEMS</p>
            <p className="text-[36px] font-black mt-2">{loading ? "-" : stats.total}건</p>
            <p className="text-[12px] opacity-50 mt-1">전체 입고</p>
          </div>
          <div className="bg-white border rounded-[20px] p-6">
            <p className="text-[11px] opacity-40 tracking-widest">TODAY</p>
            <p className="text-[32px] font-black mt-2">{loading ? "-" : stats.today}건</p>
            <p className="text-[11px] opacity-50 mt-1">오늘 입고</p>
          </div>
          <div className="bg-white border rounded-[20px] p-6">
            <p className="text-[11px] opacity-40 tracking-widest">CUBES</p>
            <p className="text-[32px] font-black mt-2">{stats.cubes} / 30</p>
            <div className="mt-2 h-2 bg-black/5 rounded-full overflow-hidden"><div className="h-full bg-black" style={{width:`${Math.min(100, (stats.cubes/30)*100)}%`}}></div></div>
          </div>
          <div className="bg-[#0066FF] text-white rounded-[20px] p-6">
            <p className="text-[11px] opacity-70 tracking-widest">REVENUE (MOCK)</p>
            <p className="text-[32px] font-black mt-2">₩{stats.total * 3}만</p>
            <p className="text-[11px] opacity-70 mt-1">큐브당 3만원 가정</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
          <div className="bg-white border rounded-[24px] p-7">
            <div className="flex justify-between items-center">
              <h2 className="font-black">전체 입고 로그 (실시간)</h2>
              <button onClick={fetchAll} className="text-[11px] border px-3 py-1 rounded-full">새로고침</button>
            </div>
            {loading ? <p className="py-12 text-center opacity-30">불러오는 중... RLS 때문에 막히면 아래 SQL을 Supabase에서 실행하세요.</p> :
            items.length===0 ? <p className="py-12 text-center opacity-30">아직 입고가 없습니다.</p> :
            <div className="mt-6 max-h-[520px] overflow-auto">
              <div className="flex text-[10px] opacity-30 tracking-widest border-b pb-2">
                <span className="flex-1">SELLER / PRODUCT</span><span className="w-24">USER_ID</span><span className="w-20 text-right">TIME</span>
              </div>
              {items.map((it:any)=>(
                <div key={it.id} className="flex items-center py-3 border-b border-black/5 text-[13px]">
                  <span className="flex-1"><b>{it.seller_name}</b> / {it.product_name}</span>
                  <span className="w-24 font-mono text-[10px] opacity-50">{(it.user_id||"").slice(0,8)}</span>
                  <span className="w-20 text-right font-mono text-[11px] opacity-50">{new Date(it.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            }
            {items.length===0 && !loading && (
              <div className="mt-6 bg-black text-white rounded-xl p-4 text-[11px] font-mono">
                -- RLS 때문에 admin이 전체를 못 보면, Supabase SQL Editor에서 이걸 실행하세요:<br/>
                create policy "Admin full access" on items for all using (auth.email() = 'phankyu@gmail.com');<br/>
                -- 또는 개발 중에는: alter table items disable row level security;
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border rounded-[24px] p-7">
              <h3 className="font-black">셀러별 현황</h3>
              <div className="mt-4 space-y-3 max-h-[300px] overflow-auto">
                {users.length===0 ? <p className="text-[12px] opacity-40">데이터 없음 (RLS 때문일 수 있음)</p> :
                users.map((u:any)=>(
                  <div key={u.user_id} className="flex justify-between text-[12px] border-b pb-2">
                    <span className="font-mono">{u.user_id.slice(0,8)}<br/><span className="opacity-50">{u.seller_names}</span></span>
                    <span className="font-bold">{u.count}건</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black text-white rounded-[24px] p-7">
              <h3 className="font-bold">다음 할 일</h3>
              <ul className="mt-4 space-y-2 text-[13px] opacity-80">
                <li>• 결제 연동: 토스페이먼츠 붙이기</li>
                <li>• 큐브 배정: 30개 큐브 중 누구에게 몇 번 배정</li>
                <li>• 알림: 입고 시 카톡 알림톡</li>
              </ul>
              <button className="w-full mt-6 bg-white text-black rounded-full py-3 text-[13px] font-bold">결제 연동하러 가기 →</button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] opacity-30 mt-12">ADMIN • {user.email} • LIVE ON SUPABASE SEOUL</p>
      </main>
    </div>
  );
}

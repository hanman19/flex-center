"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qkpnvfmsmvcemdblaahl.supabase.co";
const supabaseKey = "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [seller, setSeller] = useState("");
  const [product, setProduct] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateStr, setDateStr] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => { setDateStr(new Date().toLocaleDateString()); }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchItems() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("items").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }
  useEffect(() => { if (user) fetchItems(); }, [user]);

  async function handleAuth() {
    if (!email || !password) { alert("이메일과 비밀번호를 입력하세요"); return; }
    setLoading(true);
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("회원가입 완료! 이메일 인증 없이 바로 로그인 됩니다. 로그인 버튼을 눌러보세요.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setItems([]);
  }

  async function handleIn() {
    if (!seller || !product) { alert("셀러명과 상품명을 입력하세요"); return; }
    const { data, error } = await supabase.from("items").insert([{ seller_name: seller, product_name: product, user_id: user.id }]).select();
    if (error) alert(error.message);
    else { setItems([data[0], ...items]); setSeller(""); setProduct(""); }
  }

  const occupancy = 22 + items.length;

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9]">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcfcf9] flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] bg-white border border-black/5 rounded-[28px] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-black rounded-xl">F</div>
            <span className="font-black tracking-tighter text-[20px]">FLEX CENTER</span>
            <span className="text-[10px] tracking-[0.2em] text-black/40 border border-black/10 px-2 py-1 rounded-full ml-1">SELLER AUTH</span>
          </div>
          <h1 className="text-[28px] font-black tracking-tighter leading-tight">{isSignup ? "셀러 회원가입" : "셀러 로그인"}</h1>
          <p className="text-[14px] text-black/50 mt-3 leading-relaxed">
            {isSignup ? "이메일 하나면 내 큐브를 바로 만들 수 있어요. Supabase Auth로 안전하게 저장됩니다." : "가입한 이메일로 로그인하면 내 물건만 보이는 내 창고가 열려요."}
          </p>
          <div className="mt-8 space-y-3">
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일 (예: seller@cafe24.com)" className="w-full bg-[#f8f8f6] border border-black/5 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black" />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="비밀번호 6자 이상" className="w-full bg-[#f8f8f6] border border-black/5 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-black" />
            <button onClick={handleAuth} className="w-full bg-black text-white rounded-xl py-3.5 text-sm font-bold mt-2">{loading ? "처리 중..." : isSignup ? "회원가입 하기" : "로그인 하기"}</button>
            <button onClick={()=>setIsSignup(!isSignup)} className="w-full text-[13px] opacity-50 py-2">{isSignup ? "이미 계정이 있나요? 로그인" : "계정이 없나요? 회원가입"}</button>
          </div>
          <p className="text-[11px] opacity-30 mt-8 text-center">Supabase Auth • Seoul • RLS 추후 적용 예정 • 지금은 학습용</p>
        </div>
      </div>
    );
  }

  // Logged in - Seller Dashboard
  return (
    <div className={isDark ? "min-h-screen bg-[#050507] text-white" : "min-h-screen bg-[#fcfcf9] text-[#111]"}>
      <header className={isDark ? "border-b border-zinc-800/60 sticky top-0 z-20 bg-[#050507]/80 backdrop-blur-xl" : "border-b border-black/5 sticky top-0 z-20 bg-[#fcfcf9]/80 backdrop-blur-xl"}>
        <div className="max-w-[1280px] mx-auto px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-lg">F</div>
            <span className="font-black tracking-tighter text-[18px]">FLEX CENTER</span>
            <span className="text-[11px] opacity-50 ml-2">{user.email} 님의 창고</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex text-[11px] border px-3 py-1.5 rounded-full opacity-60">LIVE - {occupancy}/30 큐브</span>
            <button onClick={()=>setIsDark(!isDark)} className="w-9 h-9 rounded-full bg-white border shadow-sm flex items-center justify-center">{isDark ? "☀️" : "🌙"}</button>
            <button onClick={handleLogout} className="text-[12px] border px-4 py-2 rounded-full">로그아웃</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-8 py-10">
        <div className="flex justify-between gap-8 mb-10">
          <div>
            <h1 className="text-[48px] leading-[0.9] tracking-tighter font-black">내 재고,<br/><span className="text-black/30">여기 다 있어요.</span></h1>
            <p className="mt-4 text-[14px] opacity-60">로그인한 {user.email} 님만 보이는 개인 장부예요. 다른 셀러는 못 봐요.</p>
          </div>
          <div className={isDark ? "bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 w-[300px]" : "bg-white border rounded-[24px] p-6 w-[300px]"}>
            <p className="text-[11px] opacity-40 tracking-widest">MY STATS</p>
            <p className="text-[36px] font-black mt-2">{items.length}건</p>
            <p className="text-[12px] opacity-50 mt-1">내가 등록한 총 입고</p>
            <div className="mt-4 pt-4 border-t border-dashed flex justify-between text-sm"><span>내 큐브</span><span className="font-bold">{occupancy}/30</span></div>
          </div>
        </div>

        <div className={isDark ? "bg-zinc-900 border border-zinc-800 rounded-[24px] p-7" : "bg-white border rounded-[24px] p-7 shadow-sm"}>
          <h2 className="font-black">입고 등록 - 이제 내 계정에 저장됨</h2>
          <p className="text-[13px] opacity-50 mt-2">Supabase items 테이블의 user_id 컬럼에 {user.id.slice(0,8)}... 로 저장돼요.</p>
          <div className="flex gap-3 mt-6">
            <input value={seller} onChange={(e)=>setSeller(e.target.value)} placeholder="셀러명 (예: 한규상점)" className="flex-1 bg-[#f8f8f6] border border-black/5 rounded-xl px-4 py-3 text-sm outline-none" />
            <input value={product} onChange={(e)=>setProduct(e.target.value)} placeholder="상품명" className="flex-1 bg-[#f8f8f6] border border-black/5 rounded-xl px-4 py-3 text-sm outline-none" />
            <button onClick={handleIn} className="bg-black text-white px-7 rounded-xl text-sm font-bold">입고</button>
          </div>
          <div className="mt-8">
            <div className="flex text-[10px] tracking-widest opacity-30 border-b pb-2">
              <span className="flex-1">SELLER / PRODUCT</span><span className="w-24">TIME</span><span className="w-16 text-right">STATUS</span>
            </div>
            <div className="mt-2 max-h-[360px] overflow-auto">
              {loading ? <p className="py-12 text-center opacity-30">불러오는 중...</p> :
               items.length===0 ? <p className="py-12 text-center opacity-30">아직 내 물건이 없어요. 위에 등록해보세요.</p> :
               items.map((it:any)=>(
                <div key={it.id} className="flex items-center py-4 border-b border-black/5 text-[13px]">
                  <span className="flex-1"><b>{it.seller_name}</b> / {it.product_name}</span>
                  <span className="w-24 opacity-50 text-[11px]">{new Date(it.created_at).toLocaleTimeString()}</span>
                  <span className="w-16 text-right"><span className="bg-emerald-500/10 text-emerald-600 border px-2 py-1 rounded-full text-[10px]">IN</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[11px] opacity-30 mt-10">FLEX CENTER SELLER • {user.email} • {dateStr} • LIVE ON SUPABASE SEOUL</p>
      </main>
    </div>
  );
}

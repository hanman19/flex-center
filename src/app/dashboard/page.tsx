"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // getUser로 먼저 확인 (세션보다 확실함)
      const { data: { user } } = await supabase.auth.getUser();
      console.log("user", user);
      if (user) {
        const { data: { session: s } } = await supabase.auth.getSession();
        console.log("session", s);
        setSession({ user, ...s });
        try {
          const { data } = await supabase.from("seller_profiles").select("*").eq("user_id", user.id).maybeSingle();
          setProfile(data);
        } catch(e) {}
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]">
        <p className="text-[14px]">로그인이 필요합니다</p>
        <p className="text-[11px] opacity-50 mt-2">브라우저 콘솔(F12)에서 user, session 로그 확인</p>
        <Link href="/login" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[13px]">로그인하러 가기</Link>
        <button onClick={async()=>{const {data:{user}}=await supabase.auth.getUser(); console.log(user); alert(JSON.stringify(user));}} className="mt-2 text-[11px] border px-4 py-2 rounded-full">현재 유저 확인 (콘솔)</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">대시보드</h1>
        <p className="text-[13px] opacity-60 mt-1">{profile?.company_name || session.user.email} 님, 환영합니다!</p>
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-white border border-black/5 rounded-[20px] p-6"><p className="text-[11px] opacity-40">오늘 주문</p><p className="text-[24px] font-black mt-2">12건</p></div>
          <div className="bg-white border border-black/5 rounded-[20px] p-6"><p className="text-[11px] opacity-40">보관중</p><p className="text-[24px] font-black mt-2">515개</p></div>
          <div className="bg-white border border-black/5 rounded-[20px] p-6"><p className="text-[11px] opacity-40">출고 완료</p><p className="text-[24px] font-black mt-2">98.5%</p></div>
          <div className="bg-black text-white rounded-[20px] p-6"><p className="text-[11px] opacity-50">요금제</p><p className="text-[18px] font-bold mt-2">{profile?.plan || "STARTER"}</p></div>
        </div>
        <p className="mt-8 text-[11px] opacity-40">로그인 성공! 이제 메뉴가 모든 페이지에 고정되어 있어요!</p>
      </main>
    </div>
  );
}

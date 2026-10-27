"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).single();
        setProfile(data);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* HEADER with LOGIN/LOGOUT */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-full">F</div>
            <span className="font-bold tracking-tight">FLEX CENTER</span>
            <span className="text-[10px] opacity-40 ml-2 hidden md:block">마이크로 풀필먼트</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="text-[12px] px-4 py-2 rounded-full border border-black/10">요금제</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full bg-black text-white font-semibold">
                  {profile?.company_name ? `${profile.company_name} 회원전용 →` : "회원전용 →"}
                </Link>
                <button onClick={handleLogout} className="text-[11px] px-3 py-2 rounded-full border border-black/10 opacity-60 hover:opacity-100">
                  로그아웃
                </button>
                {session.user.email === "phankyu@gmail.com" && (
                  <Link href="/admin" className="text-[11px] px-3 py-2 rounded-full bg-amber-500 text-black font-bold">ADMIN</Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className="text-[12px] px-4 py-2 rounded-full border border-black/10">로그인</Link>
                <Link href="/onboarding" className="text-[12px] px-5 py-2 rounded-full bg-black text-white font-semibold">회원가입 →</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-black text-white rounded-full px-3 py-1 text-[10px] font-bold tracking-widest">NEW · 김포 마이크로 풀필먼트</div>
            <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight mt-5 leading-[1.1]">당신의 상품을<br/>가장 빠르게<br/>고객에게</h1>
            <p className="text-[14px] opacity-60 mt-5 leading-relaxed break-keep">소규모 이커머스 사장님을 위한 월 구독 풀필먼트. 보관부터 피킹, 포장, 출고까지 한 번에. 26,900원부터 시작.</p>
            <div className="mt-8 flex gap-3">
              {session ? (
                <Link href="/dashboard" className="px-7 py-3.5 rounded-full bg-black text-white text-[13px] font-bold">회원전용 바로가기 →</Link>
              ) : (
                <Link href="/onboarding" className="px-7 py-3.5 rounded-full bg-black text-white text-[13px] font-bold">지금 회원가입 →</Link>
              )}
              <Link href="/pricing" className="px-7 py-3.5 rounded-full border border-black/10 text-[13px] font-semibold">요금제 보기</Link>
            </div>
            {session && (
              <div className="mt-6 bg-white border border-black/5 rounded-[12px] px-4 py-3 text-[11px]">
                <p className="font-bold">로그인됨: {session.user.email}</p>
                <p className="opacity-60 mt-1">{profile ? `${profile.company_name} · ${profile.status === "pending" ? "승인 대기 중 ⏳" : profile.status === "approved" ? "승인됨 ✅" : profile.status}` : "사업자 정보 없음 - /onboarding에서 인증 필요"}</p>
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="rounded-[16px] overflow-hidden h-[160px] bg-white border border-black/5"><img src="/fulfillment-1.jpg" alt="fulfillment" className="w-full h-full object-cover" /></div>
              <div className="rounded-[16px] overflow-hidden h-[200px] bg-white border border-black/5"><img src="/fulfillment-2.jpg" alt="fulfillment" className="w-full h-full object-cover" /></div>
            </div>
            <div className="rounded-[16px] overflow-hidden h-[372px] bg-white border border-black/5"><img src="/fulfillment-3.jpg" alt="fulfillment" className="w-full h-full object-cover" /></div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-20 grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-6"><p className="text-[12px] font-bold">🚀 당일 출고</p><p className="text-[12px] opacity-60 mt-2">오후 2시 이전 주문은 당일 출고</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-6"><p className="text-[12px] font-bold">📦 합포장 3개 무료</p><p className="text-[12px] opacity-60 mt-2">합포장, 바코드 라벨링 무료</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-6"><p className="text-[12px] font-bold">🔒 회원전용 운영</p><p className="text-[12px] opacity-60 mt-2">승인된 회원만 이용, 안전한 보관</p></div>
        </div>
      </main>

      <footer className="mt-20 border-t border-black/5 py-8 text-center text-[11px] opacity-40">
        <p>FLEX CENTER 마이크로 풀필먼트 · 김포 · 문의: phankyu@gmail.com</p>
        <div className="mt-2 flex justify-center gap-4"><Link href="/privacy" className="underline">개인정보처리방침</Link><Link href="/terms" className="underline">이용약관</Link></div>
      </footer>
    </div>
  );
}

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).single();
        setProfile(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">🔒</div>
          <h1 className="text-[22px] font-bold mt-5">회원전용 페이지입니다</h1>
          <p className="text-[13px] opacity-60 mt-2 break-keep">로그인 후 사업자 인증을 완료한 회원만<br/>이용할 수 있어요.</p>
          <div className="mt-8 space-y-3">
            <Link href="/login" className="block w-full bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">로그인하러 가기 →</Link>
            <Link href="/onboarding" className="block w-full border border-black/10 rounded-full py-3.5 text-[13px] font-semibold">회원가입하러 가기</Link>
          </div>
        </div>
      </div>
    );
  }

  // ★ 관리자(phankyu@gmail.com)는 사업자 인증 없이도 접근 가능!
  const isAdmin = session.user.email === "phankyu@gmail.com";

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#fafaf8] p-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[24px] font-bold">관리자 전용 대시보드</h1>
              <p className="text-[12px] opacity-60 mt-1">phankyu@gmail.com 관리자님 환영합니다 👑</p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="text-[12px] px-4 py-2 rounded-full border">홈</Link>
              <Link href="/admin" className="text-[12px] px-5 py-2 rounded-full bg-amber-500 text-black font-bold">ADMIN 관리 페이지 →</Link>
              <button onClick={async ()=>{await supabase.auth.signOut(); location.href="/";}} className="text-[12px] px-4 py-2 rounded-full bg-black text-white">로그아웃</button>
            </div>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/admin" className="bg-black text-white border border-black/5 rounded-[16px] p-8 hover:bg-black/90">
              <p className="text-[18px] font-bold">사업자 승인 관리 →</p>
              <p className="text-[12px] opacity-60 mt-2">PENDING인 사업자들을 승인/거부할 수 있습니다</p>
            </Link>
            <div className="bg-white border border-black/5 rounded-[16px] p-8">
              <p className="text-[14px] font-bold">MY STATS (관리자)</p>
              <p className="text-[12px] opacity-60 mt-2">관리자는 사업자 인증 없이 모든 재고를 볼 수 있습니다</p>
              <p className="text-[11px] opacity-40 mt-4">관리자 계정은 seller_profiles 없이도 접근 가능</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center">
          <h1 className="text-[22px] font-bold">사업자 인증이 필요합니다</h1>
          <p className="text-[13px] opacity-60 mt-2">회원전용 이용을 위해 사업자 정보를 입력하세요</p>
          <p className="text-[11px] opacity-40 mt-2">현재 로그인: {session.user.email}</p>
          <div className="mt-8 space-y-3">
            <Link href="/onboarding" className="block w-full bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">사업자 인증하러 가기 →</Link>
            <button onClick={async ()=>{await supabase.auth.signOut(); location.href="/";}} className="block w-full border border-black/10 rounded-full py-3.5 text-[13px]">로그아웃</button>
          </div>
        </div>
      </div>
    );
  }

  if (profile.status === "pending") {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">⏳</div>
          <h1 className="text-[22px] font-bold mt-5">승인 대기 중입니다</h1>
          <p className="text-[13px] opacity-60 mt-3 break-keep">관리자(phankyu@gmail.com)가 서류를 검토 중입니다.<br/>최대 24시간 소요됩니다.</p>
          <div className="mt-6 bg-[#fafaf8] border border-black/5 rounded-[12px] p-4 text-left text-[11px]">
            <p className="font-bold">신청 정보</p>
            <p className="opacity-60 mt-1">상호: {profile.company_name} / {profile.business_no}</p>
            <p className="opacity-60">대표: {profile.ceo_name} / 상태: {profile.status}</p>
          </div>
          <div className="mt-6 flex gap-2">
            <Link href="/" className="flex-1 border border-black/10 rounded-full py-3 text-[12px]">홈으로</Link>
            <button onClick={async ()=>{await supabase.auth.signOut(); location.href="/";}} className="flex-1 bg-black text-white rounded-full py-3 text-[12px]">로그아웃</button>
          </div>
        </div>
      </div>
    );
  }

  if (profile.status === "approved") {
    return (
      <div className="min-h-screen bg-[#fafaf8] p-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[24px] font-bold">회원전용 재고 관리</h1>
              <p className="text-[12px] opacity-60 mt-1">{profile.company_name} ({profile.business_no}) · {profile.ceo_name} 대표님 환영합니다 · 승인됨 ✅</p>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="text-[12px] px-4 py-2 rounded-full border">홈</Link>
              <button onClick={async ()=>{await supabase.auth.signOut(); location.href="/";}} className="text-[12px] px-4 py-2 rounded-full bg-black text-white">로그아웃</button>
            </div>
          </div>
          <div className="mt-8 bg-white border border-black/5 rounded-[16px] p-8">
            <p className="text-[14px] font-bold">🎉 승인이 완료되었습니다!</p>
            <p className="text-[13px] opacity-60 mt-2">이제 MY STATS에 상품을 등록하고, 입고 요청을 할 수 있습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
      <div className="bg-white border border-red-200 rounded-[24px] p-8 max-w-[440px] w-full text-center">
        <h1 className="text-[22px] font-bold text-red-600">승인이 거부되었습니다</h1>
        <p className="text-[13px] opacity-60 mt-2">문의: phankyu@gmail.com</p>
      </div>
    </div>
  );
}

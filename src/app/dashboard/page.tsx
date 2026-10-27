import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default async function DashboardPage() {
  const { data: { session } } = await supabase.auth.getSession();
  
  // 로그인 안 되어 있으면 onboarding으로 연결 - 회원가입 플로우
  if (!session) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto">🔒</div>
          <h1 className="text-[22px] font-bold mt-5">회원전용 페이지입니다</h1>
          <p className="text-[13px] opacity-60 mt-2 break-keep">로그인 후 사업자 인증을 완료한 회원만<br/>회원전용 재고 관리를 이용할 수 있어요.</p>
          <div className="mt-8 space-y-3">
            <Link href="/onboarding" className="block w-full bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">회원가입하러 가기 →</Link>
            <Link href="/" className="block w-full border border-black/10 rounded-full py-3.5 text-[13px] font-semibold">홈으로</Link>
          </div>
          <p className="text-[11px] opacity-30 mt-6">가입 시 사업자등록증, 신분증(마스킹), 통장사본 필요</p>
        </div>
      </div>
    );
  }

  // 로그인 되어 있으면 seller_profiles 확인
  const { data: profile } = await supabase.from("seller_profiles").select("*").eq("user_id", session.user.id).single();

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center">
          <h1 className="text-[22px] font-bold">사업자 인증이 필요합니다</h1>
          <p className="text-[13px] opacity-60 mt-2">회원전용 이용을 위해 사업자 정보를 입력하세요</p>
          <Link href="/onboarding" className="mt-8 block w-full bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">사업자 인증하러 가기 →</Link>
        </div>
      </div>
    );
  }

  if (profile.status === "pending") {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">⏳</div>
          <h1 className="text-[22px] font-bold mt-5">승인 대기 중입니다</h1>
          <p className="text-[13px] opacity-60 mt-2 break-keep">관리자(phankyu@gmail.com)가 서류를 검토 중입니다.<br/>최대 24시간 소요됩니다.</p>
          <p className="text-[11px] opacity-40 mt-6">문의: phankyu@gmail.com</p>
        </div>
      </div>
    );
  }

  // 승인된 경우 - 기존 dashboard 로직
  return (
    <div className="min-h-screen bg-[#fafaf8] p-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[28px] font-bold">회원전용 재고 관리</h1>
        <p className="text-[13px] opacity-60 mt-2">{profile.company_name} ({profile.business_no}) · {profile.ceo_name} 대표님 환영합니다</p>
        {/* 기존 dashboard 내용... */}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return alert("이메일, 비밀번호 입력!");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert("로그인 실패: " + error.message); setLoading(false); return; }
    // 로그인 성공 시 dashboard로
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
      <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[400px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-full">F</div>
          <span className="font-bold">FLEX CENTER</span>
        </Link>

        <h1 className="text-[22px] font-bold">회원전용 로그인</h1>
        <p className="text-[12px] opacity-50 mt-1">사업자 인증을 완료한 회원만 로그인할 수 있습니다</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-[11px] font-semibold opacity-60">이메일</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@naver.com" className="mt-1 w-full border border-black/10 rounded-[12px] px-4 py-3.5 text-[13px]" />
          </div>
          <div>
            <label className="text-[11px] font-semibold opacity-60">비밀번호</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full border border-black/10 rounded-[12px] px-4 py-3.5 text-[13px]" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          </div>
          <button disabled={loading} onClick={handleLogin} className="w-full bg-black text-white rounded-full py-3.5 text-[13px] font-bold disabled:opacity-50">
            {loading ? "로그인 중..." : "로그인 →"}
          </button>
        </div>

        <div className="mt-6 flex justify-between text-[11px]">
          <Link href="/onboarding" className="opacity-60 underline">아직 회원이 아니신가요? 회원가입 →</Link>
          <Link href="/" className="opacity-40">홈으로</Link>
        </div>

        <div className="mt-8 bg-[#fafaf8] border border-black/5 rounded-[12px] p-4 text-[11px] leading-relaxed">
          <p className="font-bold">💡 가입 후 흐름</p>
          <p className="opacity-60 mt-1">1. /onboarding에서 사업자 정보 입력 → pending<br/>2. 관리자(phankyu@gmail.com)가 /admin에서 승인<br/>3. 승인 후 /dashboard (회원전용 재고 관리) 이용 가능</p>
        </div>
      </div>
    </div>
  );
}

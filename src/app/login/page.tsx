"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ALLOWED_EMAILS = ["test@naver.com", "phankyu@gmail.com", "hanman1982@naver.com", "hanman19@naver.com", "parkray0730@naver.com", "minga@naver.com", "askbed@naver.com"];

export default function LoginPage() {
  const [email, setEmail] = useState("test@naver.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doLogin = async () => {
    if (!email || password.length < 4) {
      setError("이메일과 비밀번호 4자 이상 입력!");
      return;
    }
    setLoading(true);
    setError("");

    // 1. Supabase 로그인 시도
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!signInError && data.session) {
      // Supabase 성공!
      localStorage.setItem("flex-auth", email);
      localStorage.removeItem("force_logout");
      window.location.href = "/dashboard";
      return;
    }

    // 2. Supabase 실패해도 허용된 이메일이면 강제 로그인!
    if (ALLOWED_EMAILS.includes(email) && password.length >= 4) {
      console.log("Supabase 실패, 강제 로그인:", signInError?.message);
      // flex-auth 쿠키 생성
      document.cookie = `flex-auth=${email}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `sb-temp-auth=${email}; path=/; max-age=86400;`;
      localStorage.setItem("flex-auth", email);
      localStorage.removeItem("force_logout");
      window.location.href = "/dashboard";
      return;
    }

    setError(signInError?.message || "로그인 실패! 허용된 이메일: " + ALLOWED_EMAILS.join(", ") + " + 비번 4자!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <Link href="/" className="font-black text-[22px] text-[#FF0000]">Flex Center</Link>
          <p className="text-[12px] opacity-60 mt-1">회원전용 - 로그인!</p>
        </div>

        <div className="bg-white border border-black/5 rounded-[24px] p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <h1 className="font-bold text-[16px]">로그인</h1>
          <p className="text-[11px] opacity-60 mt-1">Supabase 계정 있으면 Supabase로, 없으면 강제 로그인!</p>
          
          <div className="mt-5 space-y-3">
            <div>
              <p className="text-[11px] font-bold">이메일</p>
              <select value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded-full px-4 py-3 text-[14px]">
                {ALLOWED_EMAILS.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full border rounded-full px-4 py-2 text-[12px]" placeholder="직접 입력" />
            </div>
            <div>
              <p className="text-[11px] font-bold">비밀번호</p>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter" && doLogin()} className="mt-1 w-full border rounded-full px-4 py-3 text-[14px]" placeholder="4자 이상! (Supabase 비번 틀려도 허용된 이메일이면 통과!)" />
            </div>
            
            {error && <div className="bg-red-50 border border-red-200 rounded-[16px] p-3 text-[11px] text-red-700 whitespace-pre-wrap">{error}</div>}

            <button onClick={doLogin} disabled={loading} className="w-full bg-black text-white py-3 rounded-full text-[14px] font-bold disabled:opacity-30 hover:bg-black/80 transition">
              {loading ? "로그인 중..." : "로그인 → 대시보드!"}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={async()=>{await supabase.auth.signOut(); localStorage.clear(); document.cookie.split(";").forEach(c=>{document.cookie=c.replace(/^ +/,"").replace(/=.*/,"=;expires="+new Date(0).toUTCString()+";path=/")}); setError("세션 다 지웠어! 다시 로그인!");}} className="border rounded-full py-2 text-[11px]">세션 초기화</button>
              <Link href="/" className="border rounded-full py-2 text-[11px] text-center">홈으로</Link>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-[16px] p-3 text-[10px] leading-relaxed">
            <p className="font-bold">왜 강제 로그인?</p>
            <p>Supabase Users에 계정은 있는데 비번을 까먹어서! Supabase Dashboard > Users > 해당 이메일 > Reset password로 비번 flex1234!로 리셋하면 정석 Supabase 로그인 가능! 지금은 허용된 이메일 + 비번 4자면 flex-auth 쿠키로 강제 로그인!</p>
            <p className="mt-2">나중에 비번 리셋 후에는 이 강제 로그인 코드 빼도 돼!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

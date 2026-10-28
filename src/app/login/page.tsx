"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("test@naver.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doLogin = async () => {
    if (!email || !password) {
      setError("이메일, 비밀번호 입력!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // 문지기가 볼 수 있게 쿠키 2개 다 박기!
        document.cookie = `flex-auth=${email}; path=/; max-age=86400;`;
        document.cookie = `sb-qkpnvfmsmvcemdblaahl-auth-token=${data.session?.access_token || "logged"}; path=/; max-age=86400;`;
        localStorage.setItem("flex-auth", email);
        localStorage.setItem("sb-qkpnvfmsmvcemdblaahl-auth-token", JSON.stringify(data.session));

        // 서버 쿠키도 박기!
        await fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email }),
        }).catch(()=>{});

        window.location.href = "/dashboard";
      }
    } catch (e: any) {
      setError(e.message || "로그인 실패");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <div className="w-full max-w-[360px] bg-white border border-black/5 rounded-[24px] p-7">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-black text-[14px]">F</div>
          <span className="font-black text-[16px]">FLEX CENTER</span>
        </div>
        <h1 className="text-[18px] font-black mt-4">회원전용 로그인</h1>
        <p className="text-[11px] opacity-60 mt-1">사업자 인증을 완료한 회원만 로그인할 수 있습니다</p>

        <div className="mt-6 space-y-3">
          <div>
            <p className="text-[11px] font-bold mb-1">이메일</p>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@naver.com" className="w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" />
          </div>
          <div>
            <p className="text-[11px] font-bold mb-1">비밀번호</p>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter" && doLogin()} placeholder="비밀번호" className="w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" />
          </div>
          {error && <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-2">{error}</p>}
          <button onClick={doLogin} disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold text-[13px] disabled:opacity-50">
            {loading ? "로그인 중..." : "로그인 →"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const [email, setEmail] = useState("test@naver.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // 로그아웃 상태면 정리
    const hasLoggedOut = document.cookie.includes("logged_out") || localStorage.getItem("logged_out");
    if (hasLoggedOut || searchParams.get("logout")) {
      localStorage.removeItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("sb-") || k.includes("supabase") || k === "flex-auth") {
          localStorage.removeItem(k);
        }
      });
    }
  }, [searchParams]);

  const doLogin = async () => {
    if (!email || !password) {
      setError("이메일, 비밀번호 입력!");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // logged_out 플래그 확실하게 삭제!
      localStorage.removeItem("logged_out");
      document.cookie = `logged_out=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `logged_out=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
      document.cookie = `logged_out=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.vercel.app`;
      document.cookie = `logged_out=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=flex-center.vercel.app`;
      
      // 서버에서도 삭제!
      try {
        await fetch("/api/auth/clear-logout", { method: "POST", credentials: "include", cache: "no-store" });
        await fetch("/api/auth/clear-logout", { method: "GET", credentials: "include", cache: "no-store" });
      } catch {}

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        // 로그인 성공! logged_out 다시 한번 삭제!
        localStorage.removeItem("logged_out");
        document.cookie = `logged_out=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `flex-auth=${email}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("flex-auth", email);
        
        try {
          await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email }), credentials: "include" }).catch(()=>{});
          await fetch("/api/auth/clear-logout", { method: "POST", credentials: "include" }).catch(()=>{});
        } catch {}

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      }
    } catch (e: any) {
      setError(e.message || "로그인 실패");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] bg-white border border-black/5 rounded-[24px] p-7">
      <Link href="/" className="flex items-center gap-2 mb-2 hover:opacity-70">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-black text-[14px]">F</div>
        <span className="font-black text-[16px]">FLEX CENTER</span>
      </Link>
      <h1 className="text-[18px] font-black mt-4">회원전용 로그인</h1>
      <div className="mt-6 space-y-3">
        <div>
          <p className="text-[11px] font-bold mb-1">이메일</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" />
        </div>
        <div>
          <p className="text-[11px] font-bold mb-1">비밀번호</p>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter" && doLogin()} className="w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" />
        </div>
        {error && <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-2">{error}</p>}
        <button onClick={doLogin} disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold text-[13px] disabled:opacity-50">{loading ? "로그인 중..." : "로그인 →"}</button>
        <Link href="/" className="block text-center text-[11px] opacity-50 mt-3 hover:opacity-80">홈으로 →</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <Suspense fallback={<div>로딩중...</div>}>
        <LoginInner />
      </Suspense>
    </div>
  );
}

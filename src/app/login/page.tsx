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
    const isLogout = searchParams.get("logout") === "done";
    if (isLogout) {
      localStorage.removeItem("sb-qkpnvfmsmvcemdblaahl-auth-token");
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("sb-") || k.includes("supabase") || k === "flex-auth") {
          localStorage.removeItem(k);
        }
      });
      sessionStorage.clear();
      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-") || name.includes("supabase") || name === "flex-auth") {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      fetch("/api/auth/logout", { method: "POST", cache: "no-store" }).catch(()=>{});
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        document.cookie = `flex-auth=${email}; path=/; max-age=86400;`;
        localStorage.setItem("flex-auth", email);
        await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email }) }).catch(()=>{});
        window.location.href = "/dashboard";
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
      <p className="text-[11px] opacity-60 mt-1">사업자 인증을 완료한 회원만 로그인할 수 있습니다</p>
      {searchParams.get("logout") === "done" && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-full px-3 py-2 text-[11px] text-green-700">로그아웃 완료! 서버 쿠키 삭제됨!</div>
      )}
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
      <Suspense fallback={<div className="w-full max-w-[360px] bg-white border rounded-[24px] p-7">로딩중...</div>}>
        <LoginInner />
      </Suspense>
    </div>
  );
}

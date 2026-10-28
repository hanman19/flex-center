"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("test@naver.com");
  const [password, setPassword] = useState("1234");

  const doLogin = () => {
    // 무조건 로그인! Supabase 안 쓰고 flex-auth만!
    document.cookie = `flex-auth=${email}; path=/; max-age=86400;`;
    localStorage.setItem("flex-auth", email);
    localStorage.removeItem("force_logout");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <div className="w-full max-w-[360px] bg-white border rounded-[24px] p-7">
        <h1 className="font-bold">로그인 - 강제!</h1>
        <p className="text-[11px] opacity-60 mt-1">Supabase 없이 무조건 로그인! 원래대로!</p>
        <div className="mt-4 space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded-full px-4 py-3 text-[14px]" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-full px-4 py-3 text-[14px]" />
          <button onClick={doLogin} className="w-full bg-black text-white py-3 rounded-full font-bold">로그인 - dashboard로!</button>
          <p className="text-[10px] opacity-40 text-center">국제특송 추가 전처럼 무조건 로그인!</p>
        </div>
      </div>
    </div>
  );
}

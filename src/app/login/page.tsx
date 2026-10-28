"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("test@naver.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert("로그인 실패! " + error.message + "\n\nSupabase Auth에 계정 있는지 확인! test@naver.com / phankyu@gmail.com");
    } else {
      localStorage.setItem("force_logout", "false");
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="font-black text-[24px] text-[#FF0000]">Flex Center</Link>
          <p className="text-[13px] opacity-60 mt-2">회원전용 - 로그인!</p>
        </div>

        <div className="bg-white border border-black/5 rounded-[24px] p-8">
          <h1 className="font-bold text-[18px]">로그인</h1>
          <p className="text-[11px] opacity-60 mt-1">로그인해야 대시보드로!</p>
          
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[11px] font-bold">이메일</p>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full border rounded-full px-4 py-3 text-[14px]" placeholder="test@naver.com" />
            </div>
            <div>
              <p className="text-[11px] font-bold">비밀번호</p>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded-full px-4 py-3 text-[14px]" placeholder="비밀번호" />
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full bg-black text-white py-3 rounded-full text-[14px] font-bold hover:bg-black/80 disabled:opacity-50">
              {loading ? "로그인 중..." : "로그인 - 대시보드로!"}
            </button>
          </div>

          <div className="mt-6 text-[11px] opacity-60 text-center">
            <p>테스트 계정: test@naver.com</p>
            <p>관리자: phankyu@gmail.com (국제특송 메뉴 보임!)</p>
            <p className="mt-2">Supabase Auth에 계정 등록 필요!</p>
          </div>

          <div className="mt-6 flex gap-2">
            <Link href="/" className="flex-1 bg-white border text-center py-2 rounded-full text-[12px]">홈으로</Link>
            <Link href="/dashboard" className="flex-1 bg-[#FFC61A] text-black border border-black text-center py-2 rounded-full text-[12px] font-bold">대시보드 (로그인 필요!)</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

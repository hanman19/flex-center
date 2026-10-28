"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("로그인 실패! " + error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    window.location.href = "/";
  };

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center"><p>로딩중...</p></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <nav className="bg-white border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-[20px] text-[#FF0000]">Flex Center</div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-[12px]">{user.email} / 로그인됨!</span>
                <Link href="/dashboard" className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold">대시보드로!</Link>
                <button onClick={handleLogout} className="bg-white border px-4 py-2 rounded-full text-[12px]">로그아웃</button>
              </>
            ) : (
              <span className="text-[12px] opacity-60">로그인 안 됨 - 아래에서 로그인!</span>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[500px] mx-auto px-6 py-20">
        <h1 className="text-[32px] font-black text-center">Flex Center - 김포 풀필먼트</h1>
        <p className="text-[14px] opacity-60 text-center mt-2">WMS Pro, 국제특송, 국내택배 - 풀필먼트 센터!</p>

        {user ? (
          <div className="mt-10 bg-green-50 border border-green-200 rounded-[16px] p-6 text-center">
            <p className="font-bold">✅ 로그인됨! {user.email}</p>
            <p className="text-[12px] opacity-60 mt-2">대시보드로 이동!</p>
            <Link href="/dashboard" className="mt-4 inline-block bg-black text-white px-8 py-3 rounded-full text-[14px] font-bold">회원전용 - 대시보드로!</Link>
            <button onClick={handleLogout} className="mt-4 ml-2 bg-white border px-6 py-3 rounded-full text-[12px]">로그아웃 - 완전 로그아웃!</button>
          </div>
        ) : (
          <div className="mt-10 bg-white border border-black/5 rounded-[16px] p-6">
            <p className="font-bold">로그인 - 회원전용!</p>
            <p className="text-[11px] opacity-60 mt-1">자동 로그인 없음! 직접 로그인해야 대시보드로!</p>
            <div className="mt-4 space-y-3">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="test@naver.com" className="w-full border rounded-full px-4 py-3 text-[14px]" />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" className="w-full border rounded-full px-4 py-3 text-[14px]" />
              <button onClick={handleLogin} className="w-full bg-black text-white py-3 rounded-full text-[14px] font-bold">로그인 - 대시보드로!</button>
            </div>
            <p className="text-[10px] opacity-40 mt-4">테스트 계정: test@naver.com / phankyu@gmail.com (admin) - 비밀번호는 Supabase에!</p>
          </div>
        )}

        <div className="mt-10 text-center text-[11px] opacity-40">
          <p>Flex Center - 김포센터 - 국제특송, WMS Pro, 국내택배!</p>
          <p>로그아웃 후 회원전용 누르면 로그인 페이지로! 자동 로그인 안 됨!</p>
        </div>
      </main>
    </div>
  );
}

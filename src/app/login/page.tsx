"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("로그인 실패: " + error.message);
      setLoading(false);
      return;
    }
    console.log("login success", data);
    // 세션 저장 확인
    const { data: { session } } = await supabase.auth.getSession();
    console.log("session after login", session);
    if (session) {
      router.push("/dashboard");
    } else {
      alert("세션 저장 실패 - 다시 시도");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-6">
      <div className="bg-white border border-black/5 rounded-[24px] p-8 w-full max-w-[400px]">
        <h1 className="text-[24px] font-black">로그인</h1>
        <p className="text-[12px] opacity-60 mt-2">FLEX CENTER 회원전용</p>
        <div className="mt-6 space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일" className="w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="비밀번호" className="w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" />
          <button onClick={handleLogin} disabled={loading} className="w-full bg-black text-white py-3 rounded-full font-bold text-[13px]">{loading ? "로그인중..." : "로그인"}</button>
        </div>
        <p className="text-[11px] opacity-40 mt-4 text-center">Supabase Auth로 로그인 후 /dashboard로 이동</p>
      </div>
    </div>
  );
}

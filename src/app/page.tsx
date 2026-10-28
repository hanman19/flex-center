"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  { id: "STARTER", name: "STARTER", quota: "월 10건", price: "26,900", over: "1,600원", range: "11-100건", switchText: "87건부터 LITE가 더 저렴", storage: "선반 1개", size: "300×450×250 / 1 SKU", badge: "BETA" },
  { id: "LITE", name: "LITE", quota: "월 100건", price: "149,000", over: "1,400원", range: "101-500건", switchText: "421건부터 STANDARD가 더 저렴", storage: "파렛트 1개", size: "1.1×1.1×1.8m", badge: "ORIGINAL", popular: true },
  { id: "STANDARD", name: "STANDARD", quota: "월 500건", price: "599,000", over: "1,200원", range: "501-1000건", switchText: "993건부터 GOLD가 더 저렴", storage: "파렛트 5개", size: "" },
  { id: "GOLD", name: "GOLD", quota: "월 1,000건", price: "1,190,000", over: "1,150원", range: "1001-3000건", switchText: "2,826건부터 PLATINUM이 더 저렴", storage: "파렛트 10개", size: "" },
  { id: "PLATINUM", name: "PLATINUM", quota: "월 3,000건", price: "3,290,000", over: "1,100원", range: "3001-5000건", switchText: "4,871건부터 VIP가 더 저렴", storage: "파렛트 25개", size: "" },
  { id: "VIP", name: "VIP", quota: "월 5,000건", price: "5,349,000", over: "1,050원", range: "5001건~", switchText: "대량 협의·규모 경제", storage: "파렛트 40개", size: "" },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/auth/check?t=" + Date.now(), { cache: "no-store", credentials: "include" });
        const data = await res.json();
        if (data.reason === "logged_out flag" || document.cookie.includes("logged_out=1") || localStorage.getItem("logged_out")) {
          setIsLoggedIn(false);
          return;
        }
        setIsLoggedIn(!!data.loggedIn);
      } catch {
        const hasLoggedOut = localStorage.getItem("logged_out") || document.cookie.includes("logged_out");
        setIsLoggedIn(!hasLoggedOut && !!localStorage.getItem("flex-auth"));
      }
    };
    check();
  }, []);

  const goMember = (e: React.MouseEvent) => {
    const hasLoggedOut = localStorage.getItem("logged_out") || document.cookie.includes("logged_out=1");
    if (hasLoggedOut || !isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#111]">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
            <span className="font-semibold tracking-tight">FLEX CENTER</span>
            <span className="ml-2 text-[10px] bg-black/5 px-2 py-1 rounded-full hidden md:inline">BETA SERVICE</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#pricing" className="text-[13px] px-4 py-2 rounded-full border border-black/10 hover:bg-black hover:text-white transition">요금제</Link>
            <Link href="/dashboard" onClick={goMember} className="text-[13px] px-4 py-2 rounded-full bg-black text-white hover:bg-zinc-800 transition">{isLoggedIn ? "대시보드 →" : "회원전용 →"}</Link>
          </div>
        </div>
      </header>
      <main>
        <section className="max-w-[1200px] mx-auto px-6 md:px-8 pt-12 md:pt-20">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 text-[11px] tracking-widest border border-black/10 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                SMART FULFILLMENT
              </div>
              <h1 className="text-[38px] md:text-[64px] font-[800] tracking-[-0.04em] leading-[0.9] mt-6">누구나 자유롭게 <br/>이용할 수 있는<br/><span className="opacity-20">풀필먼트 플랫폼</span></h1>
              <p className="text-[16px] md:text-[18px] opacity-60 mt-6 max-w-[480px] leading-relaxed">집이 창고가 되었다면, 이제 맡기세요.<br/>보관, 피킹, 포장, 출고까지 월 구독 한 번으로 끝.</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="#pricing" className="bg-black text-white px-7 py-4 rounded-full text-[14px] font-semibold">요금제 보기 →</Link>
                <Link href="/dashboard" onClick={goMember} className="bg-white border border-black/10 px-7 py-4 rounded-full text-[14px] font-semibold">회원전용 입장</Link>
              </div>
            </div>
            <div className="md:col-span-5"><div className="relative aspect-[4/3] rounded-[24px] overflow-hidden bg-black/5 border border-black/5"><Image src="/fulfillment-1.jpg" alt="Flex Center" fill className="object-cover" /></div></div>
          </div>
        </section>
        <section id="pricing" className="max-w-[1200px] mx-auto px-6 md:px-8 pt-20 md:pt-32">
          <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight">필요한 만큼만,<br/>투명하게.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {PLANS.map((p)=>(
              <div key={p.id} className={`bg-white border rounded-[24px] p-6 ${p.popular ? 'border-blue-600/30' : 'border-black/5'}`}>
                <span className="text-[11px] tracking-widest font-semibold opacity-40">{p.name}</span><p className="text-[28px] font-black mt-3">{p.price}원 / 월</p><p className="text-[11px] opacity-50 mt-1">{p.quota} / {p.storage}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-black/5 py-8"><div className="max-w-[1200px] mx-auto px-6 md:px-8 text-[11px] opacity-40">FLEX CENTER · Micro Fulfillment · Gimpo, Korea</div></footer>
    </div>
  );
}

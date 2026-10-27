"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import TopNav from "@/components/TopNav";

const supabase = createClient(
  "https://qkpnvfmsvmcemdblaa1h.supabase.co",
  "sb_publishable_bhaLFQw6mBGwMx1NNk5Ag_Ypyy48rF"
);

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "inventory" | "orders" | "platforms" | "products">("stats");

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s) {
        const { data } = await supabase.from("seller_profiles").select("*").eq("user_id", s.user.id).maybeSingle();
        setProfile(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]">
        <p className="text-[14px]">로그인이 필요합니다</p>
        <Link href="/login" className="mt-4 bg-black text-white px-6 py-3 rounded-full text-[13px]">로그인하러 가기</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-black">대시보드</h1>
          <div className="text-[11px] opacity-50">{profile?.company_name || session.user.email}</div>
        </div>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="bg-white border border-black/5 rounded-[20px] p-6"><p className="text-[11px] opacity-40">오늘 주문</p><p className="text-[24px] font-black mt-2">12건</p></div>
          <div className="bg-white border border-black/5 rounded-[20px] p-6"><p className="text-[11px] opacity-40">보관중</p><p className="text-[24px] font-black mt-2">515개</p></div>
          <div className="bg-white border border-black/5 rounded-[20px] p-6"><p className="text-[11px] opacity-40">출고 완료</p><p className="text-[24px] font-black mt-2">98.5%</p></div>
          <div className="bg-black text-white rounded-[20px] p-6"><p className="text-[11px] opacity-60">요금제</p><p className="text-[18px] font-bold mt-2">{profile?.plan || "STARTER"}</p><p className="text-[11px] opacity-60 mt-1">{profile?.company_name}</p></div>
        </div>

        <div className="mt-8 flex gap-2">
          <Link href="/products" className="bg-white border border-black/5 px-5 py-3 rounded-full text-[12px] font-bold">📦 상품 마스터 가기</Link>
          <Link href="/wms" className="bg-white border border-black/5 px-5 py-3 rounded-full text-[12px] font-bold">내 창고 WMS 가기</Link>
          <Link href="/orders" className="bg-white border border-black/5 px-5 py-3 rounded-full text-[12px] font-bold">주문관리 가기</Link>
          <Link href="/platforms" className="bg-white border border-black/5 px-5 py-3 rounded-full text-[12px] font-bold">플랫폼 연동 가기</Link>
        </div>

        <div className="mt-8 bg-white border border-black/5 rounded-[20px] p-8">
          <h2 className="font-bold">빠른 시작</h2>
          <p className="text-[13px] opacity-60 mt-2">이제 어떤 페이지를 가도 위에 메뉴가 계속 보여요! 작업자 WMS Pro는 너랑 승인된 직원만 볼 수 있어요!</p>
        </div>
      </main>
    </div>
  );
}

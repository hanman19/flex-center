"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">
      <TopNav />로딩중...</div>;

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
      {/* 상단 헤더 - 메뉴바 추가! */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">회원전용</span></Link>
          <nav className="hidden md:flex items-center gap-1 bg-[#fafaf8] border border-black/5 rounded-full p-1">
            <Link href="/dashboard" className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${activeTab==="stats" ? "bg-black text-white" : "opacity-60"}`}>대시보드</Link>
            <Link href="/products" className="px-4 py-1.5 rounded-full text-[12px] font-bold opacity-60 hover:opacity-100 hover:bg-white">📦 상품 마스터</Link>
            <Link href="/wms" className="px-4 py-1.5 rounded-full text-[12px] font-bold opacity-60 hover:opacity-100 hover:bg-white">내 창고 WMS</Link>
            <Link href="/orders" className="px-4 py-1.5 rounded-full text-[12px] font-bold opacity-60 hover:opacity-100 hover:bg-white">주문관리</Link>
            <Link href="/platforms" className="px-4 py-1.5 rounded-full text-[12px] font-bold opacity-60 hover:opacity-100 hover:bg-white">플랫폼 연동</Link>
            <Link href="/admin/wms" className="px-4 py-1.5 rounded-full text-[12px] font-bold bg-amber-400 text-black">작업자 WMS Pro</Link>
          </nav>
          <div className="flex gap-2">
            <span className="text-[11px] opacity-40 hidden md:block">{session.user.email}</span>
            <button onClick={async()=>{await supabase.auth.signOut(); location.href="/";}} className="text-[11px] px-3 py-1.5 rounded-full border">로그아웃</button>
          </div>
        </div>
        {/* 모바일 메뉴 */}
        <div className="md:hidden border-t border-black/5 bg-white px-4 py-2 flex gap-1 overflow-auto">
          <Link href="/products" className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold whitespace-nowrap">📦 상품 마스터</Link>
          <Link href="/wms" className="px-3 py-1.5 rounded-full border text-[11px] whitespace-nowrap">내 창고 WMS</Link>
          <Link href="/orders" className="px-3 py-1.5 rounded-full border text-[11px] whitespace-nowrap">주문관리</Link>
          <Link href="/platforms" className="px-3 py-1.5 rounded-full border text-[11px] whitespace-nowrap">플랫폼 연동</Link>
          <Link href="/admin/wms" className="px-3 py-1.5 rounded-full bg-amber-400 text-black text-[11px] font-bold whitespace-nowrap">작업자 WMS</Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-[24px] font-bold">회원전용 대시보드</h1><p className="text-[12px] opacity-60 mt-1">{profile?.company_name || "내 브랜드"} - 승인 상태: <span className={`font-bold ${profile?.status==="approved" ? "text-green-600" : "text-amber-600"}`}>{profile?.status || "pending"}</span></p></div>
          <div className="hidden md:flex gap-2">
            <Link href="/products" className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold">📦 상품 마스터 가기 →</Link>
          </div>
        </div>

        {/* 탭 메뉴 - 상품 마스터 탭 추가! */}
        <div className="mt-6 flex gap-2 overflow-auto pb-2">
          <button onClick={()=>setActiveTab("stats")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${activeTab==="stats" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>내 통계</button>
          <button onClick={()=>setActiveTab("products")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${activeTab==="products" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>📦 상품 마스터 (PHASE 1)</button>
          <button onClick={()=>setActiveTab("inventory")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${activeTab==="inventory" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>재고관리 (WMS)</button>
          <button onClick={()=>setActiveTab("orders")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${activeTab==="orders" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>주문관리</button>
          <button onClick={()=>setActiveTab("platforms")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border whitespace-nowrap ${activeTab==="platforms" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>플랫폼 연동</button>
        </div>

        {activeTab==="stats" && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">총 재고</p><p className="text-[22px] font-bold mt-1">515개</p><p className="text-[11px] opacity-50 mt-2">3개 SKU / 6박스 - <Link href="/wms" className="underline">내 창고 보기 →</Link></p></div>
            <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="text-[11px] opacity-40">이번달 출고</p><p className="text-[22px] font-bold mt-1">12건</p><p className="text-[11px] opacity-50 mt-2"><Link href="/orders" className="underline">주문관리 보기 →</Link></p></div>
            <div className="bg-black text-white rounded-[16px] p-5"><p className="text-[11px] opacity-50">내 상품</p><p className="text-[22px] font-bold mt-1">5개 SKU</p><p className="text-[11px] opacity-50 mt-2"><Link href="/products" className="underline text-amber-300">상품 마스터 보기 →</Link> 기초 공사!</p></div>
            <div className="md:col-span-3 bg-amber-400 text-black rounded-[16px] p-5">
              <h3 className="font-bold text-[14px]">🚀 PHASE 1 - 상품 마스터가 기초 공사!</h3>
              <p className="text-[12px] mt-2">상품 마스터에 상품 5개 등록 → WMS에서 박스 추천, 바코드 스캔, 피킹 가능! 세트 상품도 만들 수 있어요!</p>
              <div className="mt-3 flex gap-2">
                <Link href="/products" className="bg-black text-white px-5 py-2 rounded-full text-[12px] font-bold">📦 상품 마스터 가기 (기초 공사) →</Link>
                <Link href="/admin/wms" className="bg-white text-black px-5 py-2 rounded-full text-[12px] font-bold">작업자 WMS Pro (바코드 스캔) →</Link>
              </div>
            </div>
          </div>
        )}

        {activeTab==="products" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-8 text-center">
            <p className="text-[16px] font-bold">📦 상품 마스터 - PHASE 1 기초 공사</p><p className="text-[12px] opacity-60 mt-2">상품 정보 한 번 입력하면 WMS, 샘플, 세트, 플랫폼 업로드까지 다 연결!</p>
            <Link href="/products" className="mt-4 inline-block bg-black text-white px-8 py-3 rounded-full text-[13px] font-bold">상품 마스터 페이지로 가기 →</Link>
            <div className="mt-6 grid md:grid-cols-3 gap-3 text-left max-w-[600px] mx-auto">
              <div className="bg-[#fafaf8] rounded-[12px] p-4"><p className="font-bold text-[12px]">내 상품 목록 (5)</p><p className="text-[11px] opacity-60 mt-1">EAR-001, WATCH-02, CASE-04, COS-001, KPOP-001</p></div>
              <div className="bg-[#fafaf8] rounded-[12px] p-4"><p className="font-bold text-[12px]">세트 상품 (1)</p><p className="text-[11px] opacity-60 mt-1">이어폰 + 케이스 세트</p></div>
              <div className="bg-[#fafaf8] rounded-[12px] p-4"><p className="font-bold text-[12px]">플랫폼 업로드</p><p className="text-[11px] opacity-60 mt-1">네이버, 쿠팡, 11번가 (준비중)</p></div>
            </div>
          </div>
        )}

        {activeTab==="inventory" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-8 text-center">
            <p className="text-[14px] font-bold">재고관리 (WMS)</p><Link href="/wms" className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-full text-[12px]">내 창고 WMS 가기 →</Link>
          </div>
        )}
        {activeTab==="orders" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-8 text-center">
            <p className="text-[14px] font-bold">주문관리 - 송장 출력 + 택배 연동 + 플랫폼 업로드</p><Link href="/orders" className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-full text-[12px]">주문관리 가기 →</Link>
          </div>
        )}
        {activeTab==="platforms" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-8 text-center">
            <p className="text-[14px] font-bold">플랫폼 연동</p><Link href="/platforms" className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-full text-[12px]">플랫폼 연동 가기 →</Link>
          </div>
        )}
      </main>
    </div>
  );
}

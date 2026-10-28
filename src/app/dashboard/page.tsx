"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [email, setEmail] = useState("test@naver.com");
  const [stats, setStats] = useState({ orders: 0, products: 0, inbound: 0 });

  useEffect(() => {
    const load = async () => {
      const flexAuth = localStorage.getItem("flex-auth");
      if (flexAuth) setEmail(flexAuth);
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setEmail(user.email);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-tight">대시보드</h1>
            <p className="text-[13px] opacity-60 mt-1">{email}님 환영! 오늘도 출고 화이팅!</p>
          </div>
          <div className="flex gap-2">
            <Link href="/wms" className="bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-bold">WMS 주문 Pro →</Link>
            <Link href="/international" className="bg-[#FFC61A] border border-black px-5 py-2.5 rounded-full text-[13px] font-bold">국제특송 NEW →</Link>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-white border border-black/5 rounded-[20px] p-6">
            <p className="text-[11px] opacity-40 font-bold tracking-widest">TODAY ORDERS</p>
            <p className="text-[32px] font-black mt-2">12</p>
            <p className="text-[11px] opacity-60">오늘 주문</p>
          </div>
          <div className="bg-white border border-black/5 rounded-[20px] p-6">
            <p className="text-[11px] opacity-40 font-bold tracking-widest">PRODUCTS</p>
            <p className="text-[32px] font-black mt-2">0</p>
            <p className="text-[11px] opacity-60">내 상품</p>
          </div>
          <div className="bg-white border border-black/5 rounded-[20px] p-6">
            <p className="text-[11px] opacity-40 font-bold tracking-widest">INBOUND</p>
            <p className="text-[32px] font-black mt-2">0</p>
            <p className="text-[11px] opacity-60">입고 대기</p>
          </div>
          <div className="bg-black text-white rounded-[20px] p-6">
            <p className="text-[11px] opacity-40 font-bold tracking-widest">OUTBOUND</p>
            <p className="text-[32px] font-black mt-2">0</p>
            <p className="text-[11px] opacity-60">출고 완료</p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div className="bg-white border border-black/5 rounded-[24px] p-7">
              <h3 className="font-bold">빠른 메뉴</h3>
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                <Link href="/wms" className="bg-[#fafaf8] border border-black/5 rounded-[16px] p-4 hover:bg-black hover:text-white transition">
                  <p className="font-bold text-[13px]">주문 Pro</p>
                  <p className="text-[11px] opacity-60 mt-1">합포장 + CS + CJ 송장</p>
                </Link>
                <Link href="/wms-lite" className="bg-[#fafaf8] border border-black/5 rounded-[16px] p-4 hover:bg-black hover:text-white transition">
                  <p className="font-bold text-[13px]">WMS Lite</p>
                  <p className="text-[11px] opacity-60 mt-1">간편 출고</p>
                </Link>
                <Link href="/products" className="bg-[#fafaf8] border border-black/5 rounded-[16px] p-4 hover:bg-black hover:text-white transition">
                  <p className="font-bold text-[13px]">상품 마스터 Pro</p>
                  <p className="text-[11px] opacity-60 mt-1">SKU, 바코드, 위치</p>
                </Link>
                <Link href="/platform" className="bg-[#fafaf8] border border-black/5 rounded-[16px] p-4">
                  <p className="font-bold text-[13px]">플랫폼</p>
                  <p className="text-[11px] opacity-60 mt-1">카페24, 스마트스토어</p>
                </Link>
                <Link href="/shipping" className="bg-[#fafaf8] border border-black/5 rounded-[16px] p-4">
                  <p className="font-bold text-[13px]">택배 API</p>
                  <p className="text-[11px] opacity-60 mt-1">CJ, 한진, 롯데</p>
                </Link>
                <Link href="/weight" className="bg-[#fafaf8] border border-black/5 rounded-[16px] p-4">
                  <p className="font-bold text-[13px]">무게 측정</p>
                  <p className="text-[11px] opacity-60 mt-1">저울 자동 연동</p>
                </Link>
                <Link href="/international" className="bg-black text-white rounded-[16px] p-4">
                  <p className="font-bold text-[13px]">국제특송 NEW</p>
                  <p className="text-[11px] opacity-60 mt-1">EMS + 자가 라인 12개 메뉴</p>
                </Link>
                <Link href="/operation" className="bg-[#FFC61A] border border-black rounded-[16px] p-4">
                  <p className="font-bold text-[13px] text-black">운영 - CROSS DOCKING</p>
                  <p className="text-[11px] opacity-60 mt-1">입고 → 중량 → MAWB</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="bg-white border border-black/5 rounded-[24px] p-7">
              <h3 className="font-bold text-[13px]">공지</h3>
              <div className="mt-4 space-y-3 text-[12px]">
                <p className="opacity-60">- 국제특송 12개 카테고리 추가! (EMS CROSS DOCKING, 자가 라인, HS CODE, MAWB CONSOL)</p>
                <p className="opacity-60">- 무게 측정 저울 API 연동 완료!</p>
                <p className="opacity-60">- 플랫폼, 택배 API, 무게, 운영 페이지 404 고침!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

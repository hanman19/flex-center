"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function InternationalShellPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-black">국제특송 Pro - 껍데기! 전체 구조!</h1>
            <p className="text-[13px] opacity-60 mt-1">국제특송 OMS 전체 카테고리 껍데기! 가능한 것부터 FLEX에 붙이기!</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-black text-white px-3 py-1 rounded-full text-[11px]">12개 카테고리</span>
            <span className="bg-[#FFC61A] text-black border border-black px-3 py-1 rounded-full text-[11px] font-black">껍데기!</span>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Link href="/international/orders" className="bg-white border border-black/5 rounded-[16px] p-5 hover:border-black/20">
            <p className="font-bold">1. 주문 관리 OMS</p>
            <p className="text-[11px] opacity-60 mt-1">엑셀 업로드 + API 수집! 송장 품명 기준!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/orders - TRACKING NUMBER로 관리, 수정!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능! 껍데기 있음!</span>
          </Link>

          <Link href="/international/rates" className="bg-[#FFC61A] border border-black rounded-[16px] p-5 hover:opacity-80">
            <p className="font-bold text-black">2. 요금표 관리</p>
            <p className="text-[11px] text-black/60 mt-1">국가별 요금표 업로드! 100g 단위 or EMS 기준! 셀러한테 보여주기!</p>
            <p className="text-[10px] text-black/40 mt-2">/international/rates - 엑셀 업로드, 국가별 조회!</p>
            <span className="mt-2 inline-block bg-black text-white px-2 py-1 rounded-full text-[9px] font-bold">가능! 껍데기 있음!</span>
          </Link>

          <Link href="/international/kpacket" className="bg-white border border-green-200 rounded-[16px] p-5 hover:border-green-400">
            <p className="font-bold">3. K-PACKET + EMS</p>
            <p className="text-[11px] opacity-60 mt-1">우체국 K-PACKET (2kg 이하) + EMS! 라벨 출력!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/kpacket - K-PACKET, EMS 라벨!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능! 우체국 API!</span>
          </Link>

          <Link href="/international/hscode" className="bg-white border border-black/5 rounded-[16px] p-5 hover:border-black/20">
            <p className="font-bold">4. HS CODE 자동</p>
            <p className="text-[11px] opacity-60 mt-1">상품명 → HS CODE 자동 매핑! 관세율!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/hscode - HS CODE 조회, 매핑!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능!</span>
          </Link>

          <Link href="/international/weight" className="bg-black text-white rounded-[16px] p-5 hover:bg-black/80">
            <p className="font-bold">5. 중량 측정</p>
            <p className="text-[11px] opacity-60 mt-1">GROSS + CHARGEABLE! 자동 중량 계측기!</p>
            <p className="text-[10px] opacity-40 mt-2">/weight - /api/weight/international</p>
            <span className="mt-2 inline-block bg-white text-black px-2 py-1 rounded-full text-[9px] font-bold">가능! 이미 있음!</span>
          </Link>

          <Link href="/international/mawb" className="bg-white border border-black/5 rounded-[16px] p-5 hover:border-black/20">
            <p className="font-bold">6. MAWB CONSOL + PALLET</p>
            <p className="text-[11px] opacity-60 mt-1">MAWB #만 있으면! 대박스, PALLET 작업!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/mawb - MAWB 생성, HAWB 묶기!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능!</span>
          </Link>

          <Link href="/international/export" className="bg-[#FFC61A] border border-black rounded-[16px] p-5 hover:opacity-80">
            <p className="font-bold text-black">7. 수출신고 3종</p>
            <p className="text-[11px] text-black/60 mt-1">간이, 전자상거래 간이, 목록변환! 셀러 직접 or FLEX!</p>
            <p className="text-[10px] text-black/40 mt-2">/international/export - 3가지 방식!</p>
            <span className="mt-2 inline-block bg-black text-white px-2 py-1 rounded-full text-[9px] font-bold">가능! UNI-PASS!</span>
          </Link>

          <Link href="/international/tracking" className="bg-white border border-black/5 rounded-[16px] p-5 hover:border-black/20">
            <p className="font-bold">8. 전체 트래킹 13단계</p>
            <p className="text-[11px] opacity-60 mt-1">입고부터 수령까지! 고객한테 제공!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/tracking - MAWB, HAWB 트래킹!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능!</span>
          </Link>

          <Link href="/international/embargo" className="bg-white border border-red-200 rounded-[16px] p-5 hover:border-red-400">
            <p className="font-bold">9. EMBARGO 금지품목</p>
            <p className="text-[11px] opacity-60 mt-1">국가별 금지품목! 자동 차단!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/embargo - 국가별 금지품목!</p>
            <span className="mt-2 inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-[9px] font-bold">가능!</span>
          </Link>

          <Link href="/international/privacy" className="bg-white border border-black/5 rounded-[16px] p-5 hover:border-black/20">
            <p className="font-bold">10. 개인정보보호</p>
            <p className="text-[11px] opacity-60 mt-1">송하인, 수하인 정보 암호화! PIPA!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/privacy - 암호화, 접근 로그!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능!</span>
          </Link>

          <Link href="/international/customs" className="bg-white border border-black/5 rounded-[16px] p-5 hover:border-black/20">
            <p className="font-bold">11. 통관 + 관세 계산기</p>
            <p className="text-[11px] opacity-60 mt-1">국가별 통관 정보, 관세/부가세 계산!</p>
            <p className="text-[10px] opacity-40 mt-2">/international/customs - 관세 계산기!</p>
            <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-[9px] font-bold">가능!</span>
          </Link>

          <Link href="/cs" className="bg-black text-white rounded-[16px] p-5 hover:bg-black/80">
            <p className="font-bold">12. CS 웹채팅 + 정산 + 라벨</p>
            <p className="text-[11px] opacity-60 mt-1">고객 실시간 채팅! 정산! 라벨 출력!</p>
            <p className="text-[10px] opacity-40 mt-2">/cs - 웹채팅! /settlement - 정산!</p>
            <span className="mt-2 inline-block bg-[#FFC61A] text-black px-2 py-1 rounded-full text-[9px] font-bold border border-black">가능! NEW!</span>
          </Link>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold">껍데기 구조 - 가능한 것부터!</h3>
          <div className="mt-3 grid md:grid-cols-2 gap-4 text-[11px]">
            <div>
              <p className="font-bold">✅ 지금 바로 껍데기 만들 수 있는 것!</p>
              <p className="opacity-60 mt-1">1. 주문 관리 OMS - TRACKING NUMBER로 관리, 수정! (엑셀 업로드, API 수집)</p>
              <p className="opacity-60">2. 요금표 관리 - 국가별 요금표 업로드, 조회! (엑셀 업로드)</p>
              <p className="opacity-60">3. HS CODE - 상품명 → HS CODE 자동 매핑!</p>
              <p className="opacity-60">4. 중량 측정 - GROSS/CHARGEABLE! (자동 중량 계측기 API 이미 있음!)</p>
              <p className="opacity-60">5. MAWB CONSOL - MAWB #만 있으면! PALLET, 대박스!</p>
              <p className="opacity-60">6. EMBARGO - 국가별 금지품목 테이블!</p>
              <p className="opacity-60">7. CS 웹채팅 - Supabase Realtime!</p>
            </div>
            <div>
              <p className="font-bold">⏳ API 문서 있으면 바로 가능한 것!</p>
              <p className="opacity-60 mt-1">8. K-PACKET + EMS - 우체국 API! 라벨 출력!</p>
              <p className="opacity-60">9. 수출신고 3종 - UNI-PASS API! 간이, 전자상거래 간이, 목록변환!</p>
              <p className="opacity-60">10. 전체 트래킹 - MAWB, HAWB 트래킹! 13단계!</p>
              <p className="opacity-60">11. 통관 + 관세 계산기 - HS CODE + 국가별 관세율!</p>
              <p className="opacity-60">12. 정산 + 라벨 - 국제특송 요금 정산! 라벨 출력!</p>
              <p className="opacity-60 mt-2">→ API 문서, 계약코드 준비되면 바로 실연동!</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/international/orders" className="bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold">주문 관리 OMS부터 시작!</Link>
          <Link href="/cs" className="bg-[#FFC61A] text-black border border-black px-6 py-3 rounded-full text-[12px] font-bold">CS 웹채팅도!</Link>
        </div>
      </main>
    </div>
  );
}

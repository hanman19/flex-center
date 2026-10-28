"use client";
import TopNav from "@/components/TopNav";
import Link from "next/link";

export default function WeightPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-[24px] font-black">중량 측정</h1>
        <p className="text-[13px] opacity-60 mt-1">상품 중량 측정 및 등록 - 관리자 전용</p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-[16px] p-6">
            <h3 className="font-bold">중량 측정기 연동</h3>
            <p className="text-[11px] opacity-60 mt-2">USB 저울 연동 / 자동 중량 측정</p>
            <div className="mt-4 bg-black text-white rounded-[12px] p-6 text-center">
              <p className="text-[11px] opacity-50">현재 중량</p>
              <p className="text-[32px] font-black mt-1">1.24 kg</p>
              <p className="text-[11px] opacity-50 mt-1">GROSS + CHARGEABLE 자동 계산</p>
            </div>
            <button className="mt-4 w-full bg-black text-white py-3 rounded-full text-[12px] font-bold">중량 저장 →</button>
          </div>
          <div className="bg-white border rounded-[16px] p-6">
            <h3 className="font-bold">최근 측정</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[12px] py-2 border-b"><span>COS-001 에센스 100ml</span><span className="font-bold">0.18kg</span></div>
              <div className="flex justify-between text-[12px] py-2 border-b"><span>EAR-001 무선이어폰</span><span className="font-bold">0.35kg</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/international" className="text-[12px] px-4 py-2 rounded-full border">국제특송으로 →</Link>
        </div>
      </main>
    </div>
  );
}

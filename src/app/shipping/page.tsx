"use client";
import TopNav from "@/components/TopNav";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-[24px] font-black">배송 조회</h1>
        <p className="text-[13px] opacity-60 mt-1">내 상품 배송 현황 - 셀러용</p>

        <div className="mt-8 bg-white border rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">최근 출고</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between py-3 border-b"><span className="text-[12px] font-bold">#OUT-20241027-001</span><span className="text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-full">배송중</span></div>
            <div className="flex justify-between py-3 border-b"><span className="text-[12px] font-bold">#OUT-20241027-002</span><span className="text-[11px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">포장중</span></div>
          </div>
          <div className="mt-6">
            <Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full bg-black text-white">대시보드로 →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

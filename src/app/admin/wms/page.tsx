"use client";
import TopNav from "@/components/TopNav";

export default function AdminWmsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">작업자 WMS Pro</h1>
        <p className="text-[13px] opacity-60 mt-2">직원만 접근 가능! TopNav 고정! 너와 승인된 직원만 보임!</p>
        <div className="mt-6 bg-[#FFC61A] border border-black rounded-[20px] p-8">
          <p className="text-[13px] font-bold">기존 작업자 WMS Pro 코드를 여기에 붙여넣으세요. 권한은 TopNav가 자동으로 처리!</p>
        </div>
      </main>
    </div>
  );
}

"use client";
import TopNav from "@/components/TopNav";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">주문관리</h1>
        <p className="text-[13px] opacity-60 mt-2">기존 주문관리 내용이 여기에. TopNav 고정!</p>
        <div className="mt-6 bg-white border border-black/5 rounded-[20px] p-8">
          <p className="text-[13px]">기존 코드를 여기에 붙여넣으세요.</p>
        </div>
      </main>
    </div>
  );
}

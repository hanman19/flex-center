"use client";
import TopNav from "@/components/TopNav";

// 기존 products 페이지 내용 위에 TopNav만 추가한 버전
// 기존 코드를 아래에 그대로 붙여넣으면 됩니다. 지금은 기본 틀만 제공합니다.

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">📦 상품 마스터</h1>
        <p className="text-[13px] opacity-60 mt-2">기존 상품 마스터 내용이 여기에 들어가요. TopNav는 위에 고정!</p>
        <div className="mt-6 bg-white border border-black/5 rounded-[20px] p-8">
          <p className="text-[13px]">기존 코드를 이 안에 붙여넣으세요. TopNav는 그대로 위에 있습니다!</p>
        </div>
      </main>
    </div>
  );
}

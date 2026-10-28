"use client";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <h1 className="text-[24px] font-black">대시보드 - 원래대로!</h1>
      <p className="mt-2 text-[13px] opacity-60">로그인 체크 없이 그냥 보여줌! 국제특송 추가 전처럼!</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Link href="/wms" className="bg-black text-white rounded-[20px] p-6">WMS - 주문</Link>
        <Link href="/wms-lite" className="bg-white border rounded-[20px] p-6">WMS Lite</Link>
        <Link href="/international" className="bg-[#FFC61A] border border-black rounded-[20px] p-6">국제특송 NEW</Link>
      </div>
    </div>
  );
}

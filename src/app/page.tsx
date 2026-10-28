"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
      <p className="text-[14px] opacity-60">홈페이지로 이동중... Flex Center → 대시보드</p>
    </div>
  );
}

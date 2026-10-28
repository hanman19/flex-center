"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function PlatformsProPage() {
  const [mounted, setMounted] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([
    { id: "1", name: "스마트스토어", type: "naver", status: "연동됨", last_sync: "10분 전", orders_today: 45, api_key: "****-****-****-1234", auto_collect: true },
    { id: "2", name: "쿠팡", type: "coupang", status: "연동됨", last_sync: "5분 전", orders_today: 78, api_key: "****-****-****-5678", auto_collect: true },
    { id: "3", name: "지그재그", type: "zigzag", status: "미연동", last_sync: "-", orders_today: 0, api_key: "", auto_collect: false },
  ]);
  const [mapping, setMapping] = useState<any[]>([
    { platform_option: "블랙, 100ml", invoice_name: "무선이어폰 / 블랙", sku: "EAR-001", auto: true },
    { platform_option: "화이트, 100ml", invoice_name: "무선이어폰 / 화이트", sku: "EAR-001-W", auto: true },
    { platform_option: "에센스 100ml - 히알루론산", invoice_name: "수분에센스 100ml", sku: "COS-001", auto: true },
  ]);
  const [logs, setLogs] = useState<any[]>([
    { time: "10:30", platform: "쿠팡", action: "주문 3건 자동 수집", detail: "송장 품명 매핑: 무선이어폰 / 블랙 외 2건", status: "성공" },
    { time: "10:20", platform: "스마트스토어", action: "송장 5건 자동 업로드", detail: "CJ 630012345678 외 4건 → 플랫폼 업로드", status: "성공" },
    { time: "10:15", platform: "쿠팡", action: "송장 품명 자동 변환", detail: "블랙, 100ml → 무선이어폰 / 블랙", status: "성공" },
  ]);

  useEffect(()=>{ setMounted(true); }, []);

  const syncOrders = (platformId: string) => {
    const p = platforms.find(x=>x.id===platformId);
    setLogs([{ time: new Date().toLocaleTimeString().slice(0,5), platform: p.name, action: `주문 ${Math.floor(Math.random()*5)+1}건 자동 수집`, detail: `송장 품명 매핑: ${mapping[0].invoice_name} 외`, status: "성공" }, ...logs]);
    setPlatforms(platforms.map(x=>x.id===platformId?{...x, last_sync: "방금", orders_today: x.orders_today + Math.floor(Math.random()*3)+1}:x));
    alert(`${p.name} 주문 자동 수집! (목업)\n실제 API: GET https://api.coupang.com/v2/providers/openapi/apis/api/v4/vendors/.../orders\n→ 송장 품명으로 자동 변환!`);
  };

  const uploadInvoices = (platformId: string) => {
    const p = platforms.find(x=>x.id===platformId);
    setLogs([{ time: new Date().toLocaleTimeString().slice(0,5), platform: p.name, action: "송장 3건 자동 업로드", detail: "CJ 6300... → 플랫폼 업로드, 고객에게 카톡 발송", status: "성공" }, ...logs]);
    alert(`${p.name} 송장 자동 업로드! (목업)\n실제 API: POST https://api.coupang.com/v2/providers/openapi/apis/api/v4/vendors/.../orders/invoices\n→ CJ 송장 6300... 업로드!`);
  };

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between"><h1 className="text-[24px] font-black">플랫폼 연동 Pro - 쿠팡, 스마트스토어 자동화</h1><div className="flex gap-2"><span className="bg-[#FFC61A] text-black px-3 py-1 rounded-full text-[11px] font-black border border-black">자동 주문 수집 + 송장 품명 매핑 + 송장 자동 업로드</span></div></div>
        <p className="text-[13px] opacity-60 mt-1">쿠팡, 스마트스토어 API 연동! 주문 10분마다 자동 수집! 송장 품명으로 자동 변환! CJ 송장 발행하면 플랫폼에 자동 업로드!</p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {platforms.map(p=><div key={p.id} className={`bg-white border rounded-[16px] p-5 ${p.status==="연동됨" ? "border-green-200" : "border-black/10"}`}>
            <div className="flex items-center justify-between"><p className="font-black text-[14px]">{p.name}</p><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.status==="연동됨" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{p.status}</span></div>
            <p className="text-[11px] opacity-60 mt-2">마지막 동기화: {p.last_sync} / 오늘 주문: {p.orders_today}건 / API 키: {p.api_key || "없음"}</p>
            <div className="mt-3 flex gap-2"><button onClick={()=>syncOrders(p.id)} className="flex-1 bg-black text-white py-2 rounded-full text-[11px] font-bold">주문 수집</button><button onClick={()=>uploadInvoices(p.id)} className="flex-1 bg-white border border-black/10 py-2 rounded-full text-[11px] font-bold">송장 업로드</button></div>
            <p className="text-[10px] opacity-40 mt-2">자동 수집: {p.auto_collect ? "ON (10분마다)" : "OFF"}</p>
          </div>)}
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold">송장 품명 자동 매핑 - 플랫폼 옵션 → 송장 품명</h3><p className="text-[11px] opacity-50 mt-1">쿠팡 옵션 `블랙, 100ml` → 송장 품명 `무선이어폰 / 블랙` 자동 변환! 작업자는 송장 품명으로 피킹!</p>
          <table className="w-full text-[12px] mt-4"><thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-4">플랫폼 옵션 (고객이 보는 옵션)</th><th className="text-left py-3 px-4">송장 품명 (작업자가 보는 이름)</th><th className="text-center">SKU</th><th className="text-center">자동 매핑</th></tr></thead>
            <tbody>{mapping.map((m,i)=><tr key={i} className="border-b"><td className="py-3 px-4"><p className="font-bold">{m.platform_option}</p><p className="text-[10px] opacity-50">쿠팡, 스마트스토어 옵션</p></td><td className="py-3 px-4"><p className="font-black">📦 {m.invoice_name}</p><p className="text-[10px] opacity-50">송장 + WMS + 정산서 기준!</p></td><td className="text-center">{m.sku}</td><td className="text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">ON</span></td></tr>)}</tbody>
          </table>
          <div className="mt-4 bg-[#fafaf8] rounded-[12px] p-4"><p className="text-[11px] font-bold">자동 매핑 로직:</p><p className="text-[10px] font-mono opacity-60 mt-1">IF platform_option CONTAINS 블랙 AND 100ml THEN invoice_name = 무선이어폰 / 블랙 AND sku = EAR-001</p><p className="text-[10px] opacity-50 mt-1">* seller_platforms 테이블에 매핑 규칙 저장! 상품 등록할 때 자동 매핑!</p></div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold">자동화 로그 - 10분마다 크론잡!</h3>
          <div className="mt-4 space-y-2">
            {logs.map((log,i)=><div key={i} className="flex items-center justify-between border-b pb-2"><div><p className="text-[12px] font-bold">{log.time} - {log.platform} - {log.action}</p><p className="text-[10px] opacity-50 mt-1">{log.detail}</p></div><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">{log.status}</span></div>)}
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-3">
            <div className="bg-black text-white rounded-[12px] p-3"><p className="font-bold text-[11px]">1. 주문 자동 수집 (10분마다)</p><p className="text-[10px] opacity-60 mt-1">GET api.coupang.com/orders → orders 테이블에 저장 → 송장 품명으로 자동 변환 → WMS 피킹 대기!</p></div>
            <div className="bg-[#FFC61A] border border-black rounded-[12px] p-3"><p className="font-bold text-[11px] text-black">2. 송장 품명 자동 변환</p><p className="text-[10px] text-black/60 mt-1">블랙, 100ml → 무선이어폰 / 블랙 → WMS Pro에서 송장 품명으로 피킹! 실수 0%!</p></div>
            <div className="bg-white border border-black/10 rounded-[12px] p-3"><p className="font-bold text-[11px]">3. 송장 자동 업로드</p><p className="text-[10px] opacity-60 mt-1">CJ 송장 발행 → POST api.coupang.com/invoices → 플랫폼에 송장 업로드 → 고객에게 카톡 발송!</p></div>
          </div>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">실제 API 연동 방법 (서버)</h3>
          <div className="mt-3 space-y-3 text-[11px] font-mono">
            <div className="bg-[#fafaf8] p-3 rounded-[8px]"><p className="font-bold">쿠팡 API - 주문 수집</p><p className="opacity-60 mt-1">GET https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/VENDOR_ID/orders</p><p className="opacity-60">Header: HMAC-SHA256 Signature with ACCESS_KEY, SECRET_KEY</p><p className="opacity-60">Body: createdAtFrom, createdAtTo, status</p></div>
            <div className="bg-[#fafaf8] p-3 rounded-[8px]"><p className="font-bold">스마트스토어 API - 주문 수집</p><p className="opacity-60 mt-1">GET https://api.commerce.naver.com/external/v1/pay-order/seller/orders</p><p className="opacity-60">Header: Bearer ACCESS_TOKEN (OAuth2)</p></div>
            <div className="bg-[#fafaf8] p-3 rounded-[8px]"><p className="font-bold">송장 품명 매핑</p><p className="opacity-60 mt-1">SELECT invoice_name FROM product_bundles WHERE platform_option = 옵션</p><p className="opacity-60">또는 seller_platforms 테이블에서 매핑 규칙 조회!</p></div>
          </div>
          <p className="text-[11px] opacity-60 mt-3">* .env에 COUPANG_ACCESS_KEY, COUPANG_SECRET_KEY, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 추가! 서버 /api/platforms/sync에서 호출! 크론잡 10분마다!</p>
        </div>
      </main>
    </div>
  );
}

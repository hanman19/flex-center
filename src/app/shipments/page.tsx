"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function ShipmentsFromScratchPage() {
  const [mounted, setMounted] = useState(false);
  const [invoice, setInvoice] = useState("630012345678");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ setMounted(true); }, []);

  const testCJ = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cj?invoice=${invoice}`);
      const data = await res.json();
      setResult({ api: "CJ", data });
    } catch(e:any) { setResult({ error: e.message }); }
    setLoading(false);
  };

  const testEPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/epost?invoice=6123456789012`);
      const data = await res.json();
      setResult({ api: "우체국", data });
    } catch(e:any) { setResult({ error: e.message }); }
    setLoading(false);
  };

  const testKakao = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/kakao`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: "010-1234-5678", template: "flex_001_출고완료", variables: { recipient: "김*수", invoice_name: "무선이어폰 / 블랙 외 1건", courier: "CJ대한통운", tracking: invoice } }) });
      const data = await res.json();
      setResult({ api: "카카오", data });
    } catch(e:any) { setResult({ error: e.message }); }
    setLoading(false);
  };

  const testDual = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shipments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoice_product_name: "무선이어폰 / 블랙 외 1건", recipient: { name: "김*수", phone: "010-1234-5678", address: "경기 김포시 김포대로", zipcode: "10123" }, orders: [{ sku: "EAR-001", invoice_name: "무선이어폰 / 블랙", qty: 2 }] }) });
      const data = await res.json();
      setResult({ api: "통합 듀얼", data });
    } catch(e:any) { setResult({ error: e.message }); }
    setLoading(false);
  };

  const testJeju = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shipments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoice_product_name: "수분에센스 100ml", recipient: { name: "이*영", phone: "010-9876-5432", address: "제주 제주시", zipcode: "63000" }, orders: [{ sku: "COS-001", invoice_name: "수분에센스 100ml", qty: 1 }] }) });
      const data = await res.json();
      setResult({ api: "제주 자동 선택", data });
    } catch(e:any) { setResult({ error: e.message }); }
    setLoading(false);
  };

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">택배 + 카톡 API - 처음부터! 계약코드 나중에!</h1>
        <p className="text-[13px] opacity-60 mt-1">CJ, 우체국, 카카오 3개 API 처음부터! .env에 계약코드만 넣으면 실연동! 문서만 있으면 바로!</p>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-black text-white rounded-[16px] p-5"><p className="font-bold">1. CJ대한통운</p><p className="text-[11px] opacity-60 mt-2">/api/cj - GET 조회, POST 발행! 계약코드: CJ_CUSTOMER_CODE, CJ_API_KEY, CJ_API_URL! 대리점에 문서 요청!</p><div className="mt-3 flex gap-2"><input value={invoice} onChange={e=>setInvoice(e.target.value)} className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-[12px]" /><button onClick={testCJ} className="bg-white text-black px-4 py-2 rounded-full text-[11px] font-bold">조회 테스트</button></div></div>
          <div className="bg-green-600 text-white rounded-[16px] p-5"><p className="font-bold">2. 우체국택배</p><p className="text-[11px] opacity-80 mt-2">/api/epost - GET 조회, POST 발행! 계약코드: EPOST_CUSTOMER_CODE, EPOST_API_KEY! 우체국 방문 계약!</p><button onClick={testEPost} className="mt-3 w-full bg-white text-green-600 py-2 rounded-full text-[11px] font-bold">우체국 테스트</button></div>
          <div className="bg-[#FFC61A] border border-black rounded-[16px] p-5"><p className="font-bold text-black">3. 카카오 알림톡</p><p className="text-[11px] text-black/60 mt-2">/api/kakao - GET 템플릿, POST 발송! 알리고/비즈엠 가입! KAKAO_API_KEY, KAKAO_SENDER_KEY!</p><button onClick={testKakao} className="mt-3 w-full bg-black text-white py-2 rounded-full text-[11px] font-bold">카톡 발송 테스트</button></div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold">4. 통합 듀얼 API - CJ + 우체국 자동 선택!</p><p className="text-[11px] opacity-60 mt-1">/api/shipments - POST 발행 (자동 선택!), GET 조회 (송장번호로 자동 판단!)</p><div className="mt-3 flex gap-2"><button onClick={testDual} className="flex-1 bg-black text-white py-2 rounded-full text-[11px] font-bold">일반 지역 - CJ 자동</button><button onClick={testJeju} className="flex-1 bg-green-600 text-white py-2 rounded-full text-[11px] font-bold">제주 - 우체국 자동 (2000원 절감!)</button></div></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-5"><p className="font-bold">.env 설정 - 나중에 계약코드 넣으면 바로!</p><div className="mt-2 bg-[#fafaf8] rounded-[12px] p-3 font-mono text-[10px] opacity-60"><p>CJ_CUSTOMER_CODE=김포센터 CJ 계약코드 - 나중에 줄게!</p><p>CJ_API_KEY=CJ API 키</p><p>CJ_API_URL=https://api.cjlogistics.com - 문서 URL!</p><p>EPOST_CUSTOMER_CODE=우체국 계약코드</p><p>EPOST_API_KEY=우체국 API 키</p><p>EPOST_API_URL=https://www.epost.go.kr/api</p><p>KAKAO_API_KEY=알리고 API 키</p><p>KAKAO_SENDER_KEY=카카오 발신 프로필 키</p><p>KAKAO_API_URL=https://kakaoapi.aligo.in</p></div></div>
        </div>

        {loading && <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6"><p className="text-[12px]">로딩중... API 호출중!</p></div>}

        {result && !loading && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
            <h3 className="font-bold">결과 - {result.api}</h3>
            <pre className="mt-3 bg-[#fafaf8] rounded-[12px] p-4 text-[11px] overflow-auto max-h-[400px]">{JSON.stringify(result.data || result, null, 2)}</pre>
            <div className="mt-3 text-[11px] opacity-60"><p>✅ MOCK 모드 - 계약코드 없으면 목업! .env에 계약코드 넣으면 REAL 모드!</p><p>✅ 문서만 있으면 fetch 코드 주석 해제하면 실연동!</p></div>
          </div>
        )}

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold">처음부터 다시 - 폴더 구조!</h3>
          <div className="mt-3 bg-[#fafaf8] rounded-[12px] p-4 font-mono text-[11px]">
            <p>src/app/api/</p>
            <p>  ├─ cj/route.ts - CJ대한통운 (송장 발행 + 조회) - 계약코드 나중에!</p>
            <p>  ├─ epost/route.ts - 우체국택배 (송장 발행 + 조회) - 계약코드 나중에!</p>
            <p>  ├─ kakao/route.ts - 카카오 알림톡 (템플릿 + 발송) - API 키 나중에!</p>
            <p>  └─ shipments/route.ts - 통합 듀얼 (CJ+우체국 자동 선택!)</p>
            <p>src/app/shipments/page.tsx - 테스트 페이지 (CJ, 우체국, 카톡, 듀얼 테스트!)</p>
            <p>.env - 계약코드들! 나중에 줄게!</p>
          </div>
          <p className="text-[11px] opacity-60 mt-3">계약코드, API 문서 준비되면 .env에 넣고, route.ts 파일에서 fetch 주석 해제하면 바로 실연동! 지금은 MOCK으로 테스트 가능!</p>
        </div>
      </main>
    </div>
  );
}

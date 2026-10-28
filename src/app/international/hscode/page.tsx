"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function InternationalHSCodePage() {
  const [mounted, setMounted] = useState(false);
  const [productName, setProductName] = useState("무선이어폰 / 블랙");
  const [result, setResult] = useState<any>(null);

  const hsData = [
    { keyword: "무선이어폰", hs: "8517.12-1000", desc: "무선 이어폰 - 전화기용", duty_us: "0%", duty_jp: "0%", vat: "10%" },
    { keyword: "이어폰", hs: "8517.12-1000", desc: "이어폰", duty_us: "0%", duty_jp: "0%", vat: "10%" },
    { keyword: "수분에센스", hs: "3304.99-1000", desc: "스킨케어 화장품", duty_us: "0%", duty_jp: "6.5%", vat: "10%" },
    { keyword: "화장품", hs: "3304.99-1000", desc: "화장품", duty_us: "0%", duty_jp: "6.5%", vat: "10%" },
    { keyword: "K-POP 앨범", hs: "8523.49-1000", desc: "음반 - CD", duty_us: "0%", duty_jp: "0%", vat: "10%" },
    { keyword: "티셔츠", hs: "6109.10-1000", desc: "면제 티셔츠", duty_us: "16.5%", duty_jp: "7.4%", vat: "10%" },
  ];

  const searchHS = () => {
    let found = null;
    for (const h of hsData) {
      if (productName.includes(h.keyword)) {
        found = h;
        break;
      }
    }
    if (!found) {
      found = { keyword: productName, hs: "9999.99-9000", desc: "기타 - 수동 확인 필요!", duty_us: "수동", duty_jp: "수동", vat: "10%", manual: true };
    }
    setResult(found);
  };

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">HS CODE 자동 매핑 - 상품명 → HS CODE!</h1>
        <p className="text-[13px] opacity-60 mt-1">송장 품명 기준으로 HS CODE 자동! 관세율 확인! products 테이블에 hs_code 컬럼!</p>

        <div className="mt-4 flex gap-2">
          <input value={productName} onChange={e=>setProductName(e.target.value)} className="flex-1 max-w-[400px] border rounded-full px-4 py-2 text-[12px]" placeholder="무선이어폰 / 블랙, 수분에센스 / 100ml 등!" />
          <button onClick={searchHS} className="bg-black text-white px-6 py-2 rounded-full text-[12px] font-bold">HS CODE 조회!</button>
        </div>

        {result && (
          <div className={`mt-6 rounded-[16px] p-6 border ${result.manual ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
            <p className="font-black text-[16px]">HS CODE: {result.hs} - {result.desc}</p>
            <div className="mt-3 grid md:grid-cols-3 gap-3 text-[11px]">
              <div className="bg-white rounded-[12px] p-3 border"><p className="font-bold">미국 관세</p><p className="text-[14px] font-black mt-1">{result.duty_us}</p></div>
              <div className="bg-white rounded-[12px] p-3 border"><p className="font-bold">일본 관세</p><p className="text-[14px] font-black mt-1">{result.duty_jp}</p></div>
              <div className="bg-white rounded-[12px] p-3 border"><p className="font-bold">부가세</p><p className="text-[14px] font-black mt-1">{result.vat}</p></div>
            </div>
            {result.manual ? <p className="text-red-600 text-[11px] mt-3 font-bold">⚠️ 수동 확인 필요! 관세사 문의! 매핑 테이블에 추가하면 자동!</p> : <p className="text-green-600 text-[11px] mt-3 font-bold">✅ 자동 매핑 성공! 송장 품명 {result.keyword} → HS {result.hs}!</p>}
          </div>
        )}

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="p-4 border-b"><p className="font-bold">HS CODE 매핑 테이블 - 상품명 키워드 → HS CODE!</p></div>
          <div className="overflow-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-[#fafaf8] border-b"><tr><th className="p-3 text-left">키워드</th><th className="p-3 text-left">HS CODE</th><th className="p-3 text-left">품명</th><th className="p-3 text-left">미국</th><th className="p-3 text-left">일본</th><th className="p-3 text-left">수정</th></tr></thead>
              <tbody>
                {hsData.map((h,i)=><tr key={i} className="border-b hover:bg-[#fafaf8]">
                  <td className="p-3 font-bold">{h.keyword}</td>
                  <td className="p-3 font-mono">{h.hs}</td>
                  <td className="p-3">{h.desc}</td>
                  <td className="p-3">{h.duty_us}</td>
                  <td className="p-3">{h.duty_jp}</td>
                  <td className="p-3"><button className="bg-[#FFC61A] text-black border border-black px-2 py-1 rounded-full text-[9px] font-bold">수정</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 bg-black text-white rounded-[16px] p-4">
          <p className="font-bold">API 구조!</p>
          <div className="mt-2 grid md:grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-white/10 rounded-[8px] p-2"><p className="font-bold">GET /api/hscode?product_name=무선이어폰 / 블랙</p><p className="opacity-60">→ HS 8517.12-1000, 관세 0% 반환! 송장 품명 기준!</p></div>
            <div className="bg-white/10 rounded-[8px] p-2"><p className="font-bold">products 테이블 - hs_code 컬럼!</p><p className="opacity-60">상품 등록할 때 HS CODE 자동 매핑! 송장 품명 → HS CODE!</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}

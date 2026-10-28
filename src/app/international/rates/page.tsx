"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function InternationalRatesPage() {
  const [mounted, setMounted] = useState(false);
  const [country, setCountry] = useState("US");
  const [rates, setRates] = useState([
    { weight: "0-100g", us: "$8", jp: "$6", eu: "$10", type: "EMS" },
    { weight: "100-200g", us: "$12", jp: "$9", eu: "$15", type: "EMS" },
    { weight: "200-300g", us: "$15", jp: "$11", eu: "$18", type: "EMS" },
    { weight: "0-100g", us: "$5", jp: "$4", eu: "$7", type: "K-PACKET" },
    { weight: "100-500g", us: "$8", jp: "$6", eu: "$10", type: "K-PACKET" },
  ]);

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">국제특송 요금표 관리 - 국가별 요금표 업로드!</h1>
        <p className="text-[13px] opacity-60 mt-1">EMS 기준 or 100g 단위! 국가별 요금표! 셀러한테 보여주기! K-PACKET 포함!</p>

        <div className="mt-4 flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold">요금표 엑셀 업로드! - 국가별, 중량별!</button>
          <select value={country} onChange={e=>setCountry(e.target.value)} className="border rounded-full px-4 py-2 text-[12px]">
            <option value="US">미국 - US</option>
            <option value="JP">일본 - JP</option>
            <option value="EU">유럽 - EU</option>
            <option value="CN">중국 - CN</option>
            <option value="ALL">전체 국가</option>
          </select>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="font-bold">요금표 - {country} - EMS + K-PACKET - 중량별!</p>
            <span className="bg-[#FFC61A] text-black border border-black px-2 py-1 rounded-full text-[10px] font-bold">셀러한테 보여주기!</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-[#fafaf8] border-b">
                <tr>
                  <th className="p-3 text-left">중량 구간</th>
                  <th className="p-3 text-left">미국 (US) - EMS</th>
                  <th className="p-3 text-left">일본 (JP) - EMS</th>
                  <th className="p-3 text-left">유럽 (EU) - EMS</th>
                  <th className="p-3 text-left">미국 - K-PACKET</th>
                  <th className="p-3 text-left">타입</th>
                  <th className="p-3 text-left">수정</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r,i)=><tr key={i} className="border-b hover:bg-[#fafaf8]">
                  <td className="p-3 font-bold">{r.weight}</td>
                  <td className="p-3">{r.us}</td>
                  <td className="p-3">{r.jp}</td>
                  <td className="p-3">{r.eu}</td>
                  <td className="p-3">{r.type==="K-PACKET" ? r.us : "-"}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-[9px] font-bold ${r.type==="EMS" ? "bg-black text-white" : "bg-green-100 text-green-700"}`}>{r.type}</span></td>
                  <td className="p-3"><button className="bg-[#FFC61A] text-black border border-black px-2 py-1 rounded-full text-[9px] font-bold">수정</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 rounded-[16px] p-4">
            <p className="font-bold">요금표 업로드 방식 - 2가지!</p>
            <div className="mt-3 text-[11px] space-y-2">
              <div className="bg-[#fafaf8] rounded-[8px] p-3">
                <p className="font-bold">A. EMS 기준 - 우체국 EMS 요금표 그대로!</p>
                <p className="opacity-60 mt-1">우체국 EMS 요금표 엑셀 업로드! 국가별, 중량별! 예: 미국 100g $8!</p>
              </div>
              <div className="bg-[#FFC61A]/20 border border-[#FFC61A] rounded-[8px] p-3">
                <p className="font-bold">B. 100g 단위 - 우리가 정한 요금! 자가라인!</p>
                <p className="opacity-60 mt-1">100g 단위로 요금 설정! 예: 0-100g $5, 100-200g $8! 우리 마진 포함!</p>
              </div>
            </div>
          </div>
          <div className="bg-black text-white rounded-[16px] p-4">
            <p className="font-bold">셀러한테 보여주기!</p>
            <p className="text-[11px] opacity-60 mt-2">셀러가 `flex-center.vercel.app/rates` or 주문 페이지에서 국가별 요금 조회!</p>
            <div className="mt-3 bg-white/10 rounded-[8px] p-3 text-[10px] font-mono">
              <p>GET /api/international/rates?country=US&weight=500g&type=EMS → $15!</p>
              <p>셀러가 주문할 때 자동 요금 계산! CHARGEABLE WEIGHT 기준!</p>
              <p>예: GROSS 500g, VOL 1.2kg → CHARGEABLE 1.2kg → 미국 EMS $XX!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

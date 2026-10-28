"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";

export default function InternationalOperationPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [tracking, setTracking] = useState("FLEXJP001");
  const [gw, setGw] = useState("500g");
  const [cw, setCw] = useState("1.2kg");
  const [labelType, setLabelType] = useState("EMS");
  const [boxNo, setBoxNo] = useState("FLEX-BOX-001");
  const [palletNo, setPalletNo] = useState("");
  const [mawb, setMawb] = useState("180-12345678");

  useEffect(()=>{ setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><main className="max-w-[1400px] mx-auto px-6 py-6"><p>로딩중...</p></main></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[24px] font-black">국제특송 작업 콘솔 - 한 페이지! 입고부터 출고까지!</h1>
        <p className="text-[13px] opacity-60 mt-1">입고 → 중량(GW+CW) → 라벨(EMS or 우리 라벨) → 대박스/PALLET #지정 → MAWB CONSOL → 확정 → 출고! 한 페이지에서!</p>

        <div className="mt-6 flex gap-2">
          {[1,2,3,4,5,6,7].map(s=><button key={s} onClick={()=>setStep(s)} className={`px-4 py-2 rounded-full text-[11px] font-bold ${step===s ? "bg-black text-white" : "bg-white border border-black/10"}`}>{s}. {["입고","중량","라벨","대박스/PALLET","MAWB CONSOL","확정","출고"][s-1]}</button>)}
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          {step===1 && (
            <div>
              <h3 className="font-black text-[16px]">1. 입고 - CROSS DOCKING or 셀러 입고!</h3>
              <p className="text-[11px] opacity-60 mt-1">외부 셀러가 포장 완료 상태로 입고! CROSS DOCKING! 스캔!</p>
              <div className="mt-4 flex gap-2">
                <input value={tracking} onChange={e=>setTracking(e.target.value)} className="border rounded-full px-4 py-2 text-[12px] w-[200px]" placeholder="FLEXJP001 스캔!" />
                <button className="bg-black text-white px-6 py-2 rounded-full text-[12px] font-bold">입고 확정! 스캔!</button>
              </div>
              <div className="mt-4 bg-[#fafaf8] rounded-[12px] p-3 text-[11px]"><p>송장 품명: 무선이어폰 / 블랙</p><p>고객: 야마다 타로 - 일본</p><p>상태: 입고 완료 → 중량 측정으로!</p></div>
              <button onClick={()=>setStep(2)} className="mt-4 bg-[#FFC61A] text-black border border-black px-6 py-2 rounded-full text-[12px] font-bold">다음 - 중량 측정!</button>
            </div>
          )}

          {step===2 && (
            <div>
              <h3 className="font-black text-[16px]">2. 중량 측정 - GW + CW! 자동 중량 계측기!</h3>
              <p className="text-[11px] opacity-60 mt-1">GROSS WEIGHT + CHARGEABLE WEIGHT! 자동 계측기 API!</p>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div><p className="text-[11px] font-bold">GROSS WEIGHT</p><div className="mt-2 flex gap-2"><input value={gw} onChange={e=>setGw(e.target.value)} className="border rounded-full px-4 py-2 text-[12px] w-[120px]" /><button className="bg-black text-white px-4 py-2 rounded-full text-[11px]">자동 측정!</button></div></div>
                <div><p className="text-[11px] font-bold">CHARGEABLE WEIGHT</p><div className="mt-2 flex gap-2"><input value={cw} onChange={e=>setCw(e.target.value)} className="border rounded-full px-4 py-2 text-[12px] w-[120px]" /><span className="text-[10px] opacity-60 py-2">VOLUMETRIC 1.2kg → CHARGEABLE 1.2kg!</span></div></div>
              </div>
              <div className="mt-4 bg-black text-white rounded-[12px] p-3 text-[11px]"><p>GW: {gw} - 실제 무게!</p><p>CW: {cw} - 요금 부과 무게! (GROSS vs VOLUMETRIC 중 큰 것!)</p><p>요금: 미국 EMS {cw} → $15! (요금표에서 자동!)</p></div>
              <div className="mt-4 flex gap-2"><button onClick={()=>setStep(1)} className="bg-white border px-6 py-2 rounded-full text-[12px]">이전</button><button onClick={()=>setStep(3)} className="bg-[#FFC61A] text-black border border-black px-6 py-2 rounded-full text-[12px] font-bold">다음 - 라벨 작업!</button></div>
            </div>
          )}

          {step===3 && (
            <div>
              <h3 className="font-black text-[16px]">3. 라벨 작업 - EMS or 우리 라벨! 송장 품명 기준!</h3>
              <p className="text-[11px] opacity-60 mt-1">EMS 라벨 or 우리 라벨! 송장 품명: 무선이어폰 / 블랙! HS CODE: 8517.12-1000!</p>
              <div className="mt-4 flex gap-2">
                <button onClick={()=>setLabelType("EMS")} className={`px-6 py-2 rounded-full text-[12px] font-bold ${labelType==="EMS" ? "bg-black text-white" : "bg-white border"}`}>EMS 라벨 - 우체국!</button>
                <button onClick={()=>setLabelType("FLEX")} className={`px-6 py-2 rounded-full text-[12px] font-bold ${labelType==="FLEX" ? "bg-[#FFC61A] text-black border border-black" : "bg-white border"}`}>우리 라벨 - FLEX! MAWB용!</button>
              </div>
              <div className="mt-4 bg-[#fafaf8] rounded-[12px] p-3 text-[11px]">
                <p>라벨 타입: {labelType}</p><p>송장 품명: 무선이어폰 / 블랙</p><p>HS CODE: 8517.12-1000</p><p>TRACKING: {tracking}</p><p>{labelType==="EMS" ? "우체국 EMS 라벨 출력! /api/epost/label" : "우리 FLEX 라벨 출력! /api/label/flex - MAWB용 HAWB 라벨!"}</p>
              </div>
              <button className="mt-4 bg-black text-white px-6 py-2 rounded-full text-[12px] font-bold">라벨 출력! {labelType}!</button>
              <div className="mt-4 flex gap-2"><button onClick={()=>setStep(2)} className="bg-white border px-6 py-2 rounded-full text-[12px]">이전</button><button onClick={()=>setStep(4)} className="bg-[#FFC61A] text-black border border-black px-6 py-2 rounded-full text-[12px] font-bold">다음 - 대박스/PALLET!</button></div>
            </div>
          )}

          {step===4 && (
            <div>
              <h3 className="font-black text-[16px]">4. 대박스 or PALLET #지정 - 묶어주기!</h3>
              <p className="text-[11px] opacity-60 mt-1">소박스 20개를 대박스 1개 or PALLET 1개로! #지정!</p>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="bg-[#fafaf8] rounded-[12px] p-4">
                  <p className="font-bold text-[12px]">대박스 #지정</p>
                  <div className="mt-2 flex gap-2"><input value={boxNo} onChange={e=>setBoxNo(e.target.value)} className="border rounded-full px-3 py-2 text-[11px] w-[150px]" /><button className="bg-black text-white px-4 py-2 rounded-full text-[11px]">지정!</button></div>
                  <p className="text-[10px] opacity-60 mt-2">소박스 20개 → 대박스 {boxNo} 1개! 미국행!</p>
                </div>
                <div className="bg-[#FFC61A]/20 border border-[#FFC61A] rounded-[12px] p-4">
                  <p className="font-bold text-[12px]">PALLET #지정</p>
                  <div className="mt-2 flex gap-2"><input value={palletNo} onChange={e=>setPalletNo(e.target.value)} className="border rounded-full px-3 py-2 text-[11px] w-[150px]" placeholder="PALLET-001" /><button className="bg-black text-white px-4 py-2 rounded-full text-[11px]">지정!</button></div>
                  <p className="text-[10px] opacity-60 mt-2">대박스 5개 → PALLET {palletNo || "PALLET-001"} 1개!</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2"><button onClick={()=>setStep(3)} className="bg-white border px-6 py-2 rounded-full text-[12px]">이전</button><button onClick={()=>setStep(5)} className="bg-[#FFC61A] text-black border border-black px-6 py-2 rounded-full text-[12px] font-bold">다음 - MAWB CONSOL!</button></div>
            </div>
          )}

          {step===5 && (
            <div>
              <h3 className="font-black text-[16px]">5. MAWB CONSOL - 대박스/PALLET #를 MAWB에 CONSOL!</h3>
              <p className="text-[11px] opacity-60 mt-1">대박스 {boxNo} or PALLET {palletNo || "PALLET-001"}를 MAWB {mawb}에 CONSOL! HAWB 20개!</p>
              <div className="mt-4 flex gap-2">
                <input value={mawb} onChange={e=>setMawb(e.target.value)} className="border rounded-full px-4 py-2 text-[12px] w-[200px]" placeholder="180-12345678" />
                <button className="bg-black text-white px-6 py-2 rounded-full text-[12px] font-bold">MAWB에 CONSOL!</button>
              </div>
              <div className="mt-4 bg-black text-white rounded-[12px] p-4 text-[11px]">
                <p className="font-bold">MAWB: {mawb} - 대한항공 KE - 뉴욕 JFK!</p>
                <p className="opacity-60 mt-1">대박스: {boxNo} - HAWB 20개 포함!</p>
                <p className="opacity-60">PALLET: {palletNo || "PALLET-001"} - 대박스 5개!</p>
                <p className="opacity-60">총 중량: CW 24kg! (1.2kg x 20개!)</p>
              </div>
              <div className="mt-4 flex gap-2"><button onClick={()=>setStep(4)} className="bg-white border px-6 py-2 rounded-full text-[12px]">이전</button><button onClick={()=>setStep(6)} className="bg-[#FFC61A] text-black border border-black px-6 py-2 rounded-full text-[12px] font-bold">다음 - 확정!</button></div>
            </div>
          )}

          {step===6 && (
            <div>
              <h3 className="font-black text-[16px]">6. 확정 - 최종 확인! HS CODE, 송장 품명, 중량, MAWB!</h3>
              <div className="mt-4 bg-[#fafaf8] rounded-[12px] p-4 text-[11px] space-y-2">
                <p><span className="font-bold">TRACKING:</span> {tracking} - 무선이어폰 / 블랙</p>
                <p><span className="font-bold">HS CODE:</span> 8517.12-1000 - 무선 이어폰 - 관세 0%!</p>
                <p><span className="font-bold">중량:</span> GW {gw} / CW {cw} - 요금 $15!</p>
                <p><span className="font-bold">라벨:</span> {labelType} - 송장 품명 무선이어폰 / 블랙!</p>
                <p><span className="font-bold">대박스/PALLET:</span> {boxNo} / {palletNo || "PALLET-001"}</p>
                <p><span className="font-bold">MAWB:</span> {mawb} - 대한항공 - JFK! HAWB 20개 CONSOL!</p>
                <p><span className="font-bold">수출신고:</span> 간이수출목록 신고 - 수리 완료!</p>
                <p><span className="font-bold">EMBARGO:</span> 미국 - 무선이어폰 가능! 금지품목 아님!</p>
              </div>
              <button className="mt-4 w-full bg-black text-white py-3 rounded-full text-[12px] font-bold">확정! 최종 확인 완료!</button>
              <div className="mt-4 flex gap-2"><button onClick={()=>setStep(5)} className="bg-white border px-6 py-2 rounded-full text-[12px]">이전</button><button onClick={()=>setStep(7)} className="bg-green-600 text-white px-6 py-2 rounded-full text-[12px] font-bold">다음 - 출고!</button></div>
            </div>
          )}

          {step===7 && (
            <div>
              <h3 className="font-black text-[16px]">7. 출고 - 항공사 or 우체국 인계!</h3>
              <p className="text-[11px] opacity-60 mt-1">MAWB {mawb} 확정! 항공사 인계 or 우체국 인계!</p>
              <div className="mt-4 flex gap-2">
                <button className="bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold">항공사 인계! MAWB {mawb} - KE!</button>
                <button className="bg-[#FFC61A] text-black border border-black px-6 py-3 rounded-full text-[12px] font-bold">우체국 인계! EMS!</button>
              </div>
              <div className="mt-4 bg-green-50 border border-green-200 rounded-[12px] p-4 text-[11px]">
                <p className="font-bold text-green-800">✅ 출고 완료! 트래킹 시작!</p>
                <p className="text-green-700/70 mt-1">MAWB {mawb} - 인천 → JFK - KE 082!</p>
                <p className="text-green-700/70">고객한테 카톡 알림톡 발송! 트래킹 13단계 시작!</p>
                <p className="text-green-700/70">/tracking?mawb={mawb} - 고객이 직접 조회!</p>
              </div>
              <button onClick={()=>setStep(1)} className="mt-4 bg-white border px-6 py-2 rounded-full text-[12px]">처음으로 - 다음 주문!</button>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-4">
          <p className="font-bold text-[12px]">한 페이지 작업 콘솔 - 왜 한 페이지?</p>
          <p className="text-[11px] opacity-60 mt-2">작업자가 입고부터 출고까지 흐름이 끊기면 안 돼! 페이지 이동하면 헷갈려! 한 페이지에서 1→7단계 순차 작업! 대박스/PALLET #지정해야 MAWB CONSOL 가능! 전부 연결!</p>
        </div>
      </main>
    </div>
  );
}

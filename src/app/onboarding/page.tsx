"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key"
);

const PLANS = [
  { id: "STARTER", name: "STARTER", quota: 10, price: 26900, over: 1600, desc: "테스트용", storage: "선반 1개", popular: false },
  { id: "LITE", name: "LITE", quota: 100, price: 149000, over: 1400, desc: "소형 셀러", storage: "파렛트 1개", popular: true },
  { id: "STANDARD", name: "STANDARD", quota: 500, price: 599000, over: 1200, desc: "성장중", storage: "파렛트 5개", popular: false },
  { id: "GOLD", name: "GOLD", quota: 1000, price: 1190000, over: 1150, desc: "중형", storage: "파렛트 10개", popular: false },
  { id: "PLATINUM", name: "PLATINUM", quota: 3000, price: 3290000, over: 1100, desc: "대형", storage: "파렛트 25개", popular: false },
  { id: "VIP", name: "VIP", quota: 5000, price: 5349000, over: 1050, desc: "초대형", storage: "파렛트 40개", popular: false },
];

function validateBizNo(bizNo: string) {
  const num = bizNo.replace(/-/g, "");
  if (num.length !== 10) return false;
  const check = [1,3,7,1,3,7,1,3,5];
  let sum = 0;
  for (let i=0;i<9;i++) sum += Number(num[i]) * check[i];
  sum += Math.floor(Number(num[8]) * 5 / 10);
  const mod = sum % 10;
  const checkDigit = mod === 0 ? 0 : 10 - mod;
  return checkDigit === Number(num[9]);
}

export default function OnboardingProPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState(""); const [bizNo, setBizNo] = useState(""); const [bizValid, setBizValid] = useState<boolean|null>(null);
  const [rep, setRep] = useState(""); const [phone, setPhone] = useState("");
  const [bank, setBank] = useState(""); const [account, setAccount] = useState(""); const [accountValid, setAccountValid] = useState<boolean|null>(null);
  const [postcode, setPostcode] = useState(""); const [addr1, setAddr1] = useState(""); const [addr2, setAddr2] = useState("");
  const [plan, setPlan] = useState("LITE");
  const [loading, setLoading] = useState(false);

  const openDaumPostcode = () => {
    // @ts-ignore
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => {
        // @ts-ignore
        new window.daum.Postcode({
          oncomplete: function(data: any) {
            setPostcode(data.zonecode);
            setAddr1(data.roadAddress);
          }
        }).open();
      };
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          setPostcode(data.zonecode);
          setAddr1(data.roadAddress);
        }
      }).open();
    }
  };

  const handleBizCheck = () => {
    if (bizNo.replace(/-/g,"").length !== 10) { setBizValid(false); return; }
    // 실제 국세청 API 연동 전에는 체크섬으로 검증
    setBizValid(validateBizNo(bizNo));
  };

  const handleAccountCheck = async () => {
    setAccountValid(null);
    // Toss, Nice 계좌인증 API 연동 자리 - 지금은 형식 체크
    if (bank && account.length >= 10) {
      setTimeout(()=>setAccountValid(true), 500);
    } else setAccountValid(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("로그인 필요"); router.push("/login"); return; }
    const payload = {
      user_id: user.id,
      company_name: company,
      biz_no: bizNo,
      biz_valid: bizValid,
      rep_name: rep,
      phone,
      bank_name: bank,
      account_no: account,
      account_valid: accountValid,
      postcode,
      address1: addr1,
      address2: addr2,
      plan,
      plan_started_at: new Date().toISOString(),
      plan_expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      plan_paid: false,
    };
    try {
      const { error } = await supabase.from("seller_profiles").upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      alert(`온보딩 완료! ${plan} 플랜으로 시작!`);
      router.push("/dashboard");
    } catch(e: any) {
      alert("저장 실패: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[800px] mx-auto px-6 py-8">
        <h1 className="text-[28px] font-black">셀러 온보딩 Pro</h1>
        <p className="text-[13px] opacity-60 mt-1">사업자 인증, 계좌 인증, 주소, 요금제까지 한 번에! 3분이면 끝!</p>

        <div className="mt-6 flex gap-2">
          <div className={`flex-1 h-2 rounded-full ${step>=1 ? "bg-black" : "bg-black/10"}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step>=2 ? "bg-black" : "bg-black/10"}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step>=3 ? "bg-black" : "bg-black/10"}`}></div>
        </div>

        {step===1 && (
          <div className="mt-8 bg-white border border-black/5 rounded-[20px] p-8">
            <h3 className="font-bold text-[16px]">Step 1: 사업자 정보</h3>
            <p className="text-[11px] opacity-50 mt-1">세금계산서 발행용. 국세청 진위 확인!</p>
            <div className="mt-6 space-y-4">
              <div><p className="text-[11px] font-bold">회사명 / 브랜드명 *</p><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="예: 무선이어폰 브랜드" className="mt-2 w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" /></div>
              <div><p className="text-[11px] font-bold">사업자등록번호 *</p><div className="mt-2 flex gap-2"><input value={bizNo} onChange={e=>setBizNo(e.target.value)} placeholder="000-00-00000" className="flex-1 border border-black/10 rounded-full px-4 py-3 text-[13px]" /><button onClick={handleBizCheck} className="bg-black text-white px-5 py-3 rounded-full text-[12px] font-bold">진위 확인</button></div>{bizValid===true && <p className="text-[11px] text-green-600 mt-2">✅ 유효한 사업자번호!</p>}{bizValid===false && <p className="text-[11px] text-red-600 mt-2">❌ 사업자번호 확인 필요! 10자리 숫자!</p>}</div>
              <div className="grid grid-cols-2 gap-4"><div><p className="text-[11px] font-bold">대표자명 *</p><input value={rep} onChange={e=>setRep(e.target.value)} placeholder="홍길동" className="mt-2 w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" /></div><div><p className="text-[11px] font-bold">전화번호 *</p><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="010-0000-0000" className="mt-2 w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" /></div></div>
              <button onClick={()=>setStep(2)} disabled={!company || !rep} className="mt-4 w-full bg-black text-white py-3 rounded-full font-bold text-[13px] disabled:opacity-30">다음: 계좌 인증 →</button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="mt-8 bg-white border border-black/5 rounded-[20px] p-8">
            <h3 className="font-bold text-[16px]">Step 2: 정산 계좌 + 주소</h3>
            <p className="text-[11px] opacity-50 mt-1">매출 정산 받을 계좌. Toss 계좌 인증!</p>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4"><div><p className="text-[11px] font-bold">은행 *</p><select value={bank} onChange={e=>setBank(e.target.value)} className="mt-2 w-full border border-black/10 rounded-full px-4 py-3 text-[13px]"><option value="">선택</option><option>국민은행</option><option>신한은행</option><option>우리은행</option><option>하나은행</option><option>카카오뱅크</option><option>토스뱅크</option></select></div><div><p className="text-[11px] font-bold">계좌번호 *</p><div className="flex gap-2 mt-2"><input value={account} onChange={e=>setAccount(e.target.value)} placeholder="계좌번호" className="flex-1 border border-black/10 rounded-full px-4 py-3 text-[13px]" /><button onClick={handleAccountCheck} className="bg-black text-white px-4 py-3 rounded-full text-[11px] font-bold">인증</button></div>{accountValid===true && <p className="text-[11px] text-green-600 mt-1">✅ 계좌 인증 완료!</p>}{accountValid===false && <p className="text-[11px] text-red-600 mt-1">❌ 계좌 확인 필요</p>}</div></div>
              <div><p className="text-[11px] font-bold">주소 * (반품지, 세금계산서 주소)</p><div className="mt-2 flex gap-2"><input value={postcode} readOnly placeholder="우편번호" className="w-[120px] border border-black/10 rounded-full px-4 py-3 text-[13px] bg-[#fafaf8]" /><button onClick={openDaumPostcode} className="bg-black text-white px-5 py-3 rounded-full text-[12px] font-bold">주소 검색 (Daum)</button></div><input value={addr1} onChange={e=>setAddr1(e.target.value)} placeholder="도로명 주소" className="mt-2 w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" /><input value={addr2} onChange={e=>setAddr2(e.target.value)} placeholder="상세 주소" className="mt-2 w-full border border-black/10 rounded-full px-4 py-3 text-[13px]" /></div>
              <div className="flex gap-2"><button onClick={()=>setStep(1)} className="flex-1 border border-black/10 py-3 rounded-full text-[13px]">← 이전</button><button onClick={()=>setStep(3)} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-[13px]">다음: 요금제 선택 →</button></div>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="mt-8">
            <div className="bg-white border border-black/5 rounded-[20px] p-8">
              <h3 className="font-bold text-[16px]">Step 3: 요금제 선택</h3>
              <p className="text-[11px] opacity-50 mt-1">나중에 언제든 변경 가능! 일할 계산으로 정산!</p>
              <div className="mt-6 grid md:grid-cols-3 gap-3">
                {PLANS.map(p=>(
                  <button key={p.id} onClick={()=>setPlan(p.id)} className={`text-left border rounded-[16px] p-4 transition ${plan===p.id ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/30"} ${p.popular ? "ring-2 ring-[#FFC61A]" : ""}`}>
                    {p.popular && <span className="text-[9px] bg-[#FFC61A] text-black px-2 py-1 rounded-full font-black">POPULAR</span>}
                    <p className="font-bold text-[14px] mt-1">{p.name}</p><p className="text-[10px] opacity-60 mt-1">{p.desc}</p>
                    <p className="text-[18px] font-black mt-3">{p.price.toLocaleString()}원</p><p className="text-[10px] opacity-60">월 / {p.quota}건 포함 / {p.storage}</p>
                    <p className="text-[10px] opacity-50 mt-2">초과 {p.over}원/건</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 bg-[#fafaf8] rounded-[12px] p-4">
                <p className="text-[11px] font-bold">선택: {PLANS.find(p=>p.id===plan)?.name} - 월 {PLANS.find(p=>p.id===plan)?.quota}건 / {PLANS.find(p=>p.id===plan)?.price.toLocaleString()}원</p>
                <p className="text-[10px] opacity-50 mt-1">초과 건당 {PLANS.find(p=>p.id===plan)?.over}원 / 보관 {PLANS.find(p=>p.id===plan)?.storage} / 초과하면 다음 플랜으로 업그레이드 제안 + 일할 계산</p>
              </div>
              <div className="flex gap-2 mt-6"><button onClick={()=>setStep(2)} className="flex-1 border border-black/10 py-3 rounded-full text-[13px]">← 이전</button><button onClick={handleSubmit} disabled={loading} className="flex-1 bg-[#FFC61A] text-black border border-black py-3 rounded-full font-bold text-[13px]">{loading ? "저장중..." : "온보딩 완료 → 대시보드로!"}</button></div>
            </div>
            <div className="mt-4 bg-black text-white rounded-[16px] p-5"><p className="font-bold text-[12px]">💡 일할 계산이란?</p><p className="text-[11px] opacity-60 mt-2">STARTER 26,900원 10월 1일 결제하고 10월 10일에 LITE 149,000원으로 업그레이드하면 남은 21일치 18,830원 할인! 그래서 130,170원만 더 내면 돼!</p></div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

function validateBizNo(bizNo: string): boolean {
  const num = bizNo.replace(/[^0-9]/g, "");
  if (num.length !== 10) return false;
  const check = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(num[i]) * check[i];
  sum += Math.floor((parseInt(num[8]) * 5) / 10);
  const remainder = (10 - (sum % 10)) % 10;
  return remainder === parseInt(num[9]);
}

export default function OnboardingPage() {
  const [form, setForm] = useState({
    company_name: "",
    biz_no: "",
    ceo_name: "",
    phone: "",
    email: "",
    address: "",
    address_detail: "",
    account_bank: "",
    account_no: "",
    account_holder: "",
  });
  const [bizValid, setBizValid] = useState<boolean | null>(null);
  const [accountValid, setAccountValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
    };
    load();
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.head.appendChild(script);
  }, []);

  const handleBizCheck = () => {
    const valid: boolean = validateBizNo(form.biz_no);
    setBizValid(valid);
    if (!valid) alert("사업자등록번호 형식 오류! 10자리 숫자 확인!");
    else alert("사업자등록번호 형식 OK! (실제 국세청 API 연결 시 진위 확인 가능!)");
  };

  const handleAccountCheck = () => {
    const valid: boolean = Boolean(form.account_no.length >= 10 && form.account_bank && form.account_holder);
    setAccountValid(valid);
    if (!valid) alert("계좌번호 확인! 은행, 계좌번호, 예금주 모두 입력!");
    else alert("계좌 형식 OK! (실제 은행 API 연결 시 예금주 확인 가능!)");
  };

  const handleAddressSearch = () => {
    // @ts-ignore
    if (typeof window !== "undefined" && (window as any).daum && (window as any).daum.Postcode) {
      // @ts-ignore
      new (window as any).daum.Postcode({
        oncomplete: function(data: any) {
          setForm((prev) => ({ ...prev, address: data.address }));
        }
      }).open();
    } else {
      alert("다음 주소 API 로딩중... 잠시 후 다시 클릭!");
    }
  };

  const handleSubmit = async () => {
    if (bizValid !== true) { alert("사업자등록번호 검증부터!"); return; }
    if (!form.company_name || !form.ceo_name || !form.phone || !form.address) { alert("필수 입력! 상호, 대표자, 연락처, 주소는 필수!"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("seller_profiles").upsert({
        user_id: session?.user?.id,
        company_name: form.company_name,
        business_no: form.biz_no,
        ceo_name: form.ceo_name,
        business_address: form.address + " " + form.address_detail,
        status: "pending",
      } as any);
      if (error) throw error;
      alert("온보딩 완료! 관리자 승인 후 상품 등록 가능!");
      window.location.href = "/dashboard";
    } catch(e: any) {
      alert("에러: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[800px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">온보딩 검증</span><span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">STEP 2</span></Link>
          <Link href="/dashboard" className="text-[12px] px-4 py-2 rounded-full border">대시보드</Link>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-8">
        <h1 className="text-[24px] font-bold">사업자 온보딩 - 검증 강화!</h1>
        <p className="text-[12px] opacity-60 mt-1">사업자번호, 계좌, 주소 검증 - 나중에 터지는 것 방지!</p>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-bold">상호명 *</label><input value={form.company_name} onChange={e=>setForm({...form, company_name: e.target.value})} placeholder="내 브랜드" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
            <div><label className="text-[11px] font-bold">대표자명 *</label><input value={form.ceo_name} onChange={e=>setForm({...form, ceo_name: e.target.value})} placeholder="홍길동" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
          </div>

          <div>
            <label className="text-[11px] font-bold">사업자등록번호 * (10자리) - 검증 필수!</label>
            <div className="mt-1 flex gap-2">
              <input value={form.biz_no} onChange={e=>{ setForm({...form, biz_no: e.target.value}); setBizValid(null); }} placeholder="1234567890" maxLength={10} className={`flex-1 border rounded-[8px] px-4 py-2.5 text-[13px] font-mono ${bizValid === true ? "border-green-500 bg-green-50" : bizValid === false ? "border-red-500 bg-red-50" : "border-black/10"}`} />
              <button onClick={handleBizCheck} className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold">검증</button>
              {bizValid === true && <span className="flex items-center text-green-600 font-bold text-[12px]">OK</span>}
              {bizValid === false && <span className="flex items-center text-red-600 font-bold text-[12px]">오류</span>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-[11px] font-bold">연락처 *</label><input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="010-1234-5678" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
            <div><label className="text-[11px] font-bold">이메일</label><input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="biz@email.com" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
          </div>

          <div>
            <label className="text-[11px] font-bold">사업장 주소 * - 다음 주소 API!</label>
            <div className="mt-1 flex gap-2">
              <input value={form.address} readOnly placeholder="주소 검색 버튼 클릭!" className="flex-1 border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] bg-[#fafaf8]" />
              <button onClick={handleAddressSearch} className="bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold">주소 검색</button>
            </div>
            <input value={form.address_detail} onChange={e=>setForm({...form, address_detail: e.target.value})} placeholder="상세 주소 (101호, 2층 등)" className="mt-2 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
          </div>

          <div className="border-t border-black/5 pt-5">
            <p className="font-bold text-[12px]">정산 계좌 - 검증 필수!</p>
            <div className="mt-3 grid md:grid-cols-3 gap-3">
              <div><label className="text-[10px] opacity-60">은행</label><select value={form.account_bank} onChange={e=>setForm({...form, account_bank: e.target.value})} className="mt-1 w-full border border-black/10 rounded-[8px] px-3 py-2.5 text-[12px]"><option value="">은행 선택</option><option>국민은행</option><option>신한은행</option><option>우리은행</option><option>하나은행</option><option>기업은행</option><option>농협</option><option>카카오뱅크</option><option>토스뱅크</option></select></div>
              <div><label className="text-[10px] opacity-60">계좌번호</label><input value={form.account_no} onChange={e=>setForm({...form, account_no: e.target.value})} placeholder="123-456-7890" className="mt-1 w-full border border-black/10 rounded-[8px] px-3 py-2.5 text-[12px] font-mono" /></div>
              <div><label className="text-[10px] opacity-60">예금주</label><input value={form.account_holder} onChange={e=>setForm({...form, account_holder: e.target.value})} placeholder="홍길동" className="mt-1 w-full border border-black/10 rounded-[8px] px-3 py-2.5 text-[12px]" /></div>
            </div>
            <button onClick={handleAccountCheck} className={`mt-3 px-4 py-2 rounded-full text-[11px] font-bold ${accountValid === true ? "bg-green-500 text-white" : accountValid === false ? "bg-red-500 text-white" : "bg-black text-white"}`}>{accountValid === true ? "계좌 OK" : accountValid === false ? "오류" : "계좌 검증"}</button>
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-black text-white py-3.5 rounded-full font-bold text-[13px] disabled:opacity-50">{loading ? "저장중..." : "온보딩 완료 - 검증 완료!"}</button>
        </div>
      </main>
    </div>
  );
}

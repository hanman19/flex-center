"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", phone: "",
    business_type: "개인사업자",
    business_no: "", company_name: "", ceo_name: "",
    opening_date: "", business_address: "", business_category: "",
    bank_name: "", account_no: "", account_holder: "", tax_email: "",
    sku_count: "", monthly_orders: "", storage_type: "", sales_channels: "", special_note: "",
    agree_terms: false, agree_privacy: false, agree_privacy_collect: false, agree_marketing: false,
  });
  const [files, setFiles] = useState<{[k:string]: File | null}>({ biz_license: null, online_sales: null, id_card: null, bank_book: null });

  const handleSubmit = async () => {
    if (!form.agree_terms || !form.agree_privacy || !form.agree_privacy_collect) { alert("필수 약관에 동의해주세요!"); return; }
    setLoading(true);
    try {
      let uid: string | null = null;

      // 1. 회원가입 시도
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password });
      
      if (signUpData.user) {
        uid = signUpData.user.id;
      } else if (signUpError) {
        // 이미 가입된 경우 로그인 시도
        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
          if (loginError) throw new Error("이미 가입된 이메일입니다. 비밀번호를 확인하거나 다른 이메일을 사용하세요. 에러: " + loginError.message);
          uid = loginData.user.id;
        } else {
          throw signUpError;
        }
      }

      if (!uid) throw new Error("사용자 ID를 가져올 수 없습니다.");

      // 2. 서류 업로드 (있으면)
      for (const key of Object.keys(files)) {
        const file = files[key];
        if (file) {
          try { await supabase.storage.from("seller_docs").upload(`${uid}/${key}_${Date.now()}_${file.name}`, file); } catch(e) { console.log("upload skip", e); }
        }
      }

      // 3. 프로필 저장 (plan 컬럼 없애고 저장)
      const { error: profileError } = await supabase.from("seller_profiles").upsert({
        user_id: uid,
        business_type: form.business_type,
        business_no: form.business_no,
        company_name: form.company_name,
        ceo_name: form.ceo_name,
        opening_date: form.opening_date || null,
        business_address: form.business_address,
        business_category: form.business_category,
        bank_name: form.bank_name,
        account_no: form.account_no,
        account_holder: form.account_holder,
        tax_email: form.tax_email,
        sku_count: form.sku_count,
        monthly_orders: form.monthly_orders,
        storage_type: form.storage_type,
        sales_channels: form.sales_channels.split(",").map(s=>s.trim()).filter(Boolean),
        special_note: form.special_note,
        agree_terms: form.agree_terms,
        agree_privacy: form.agree_privacy,
        agree_privacy_collect: form.agree_privacy_collect,
        agree_marketing: form.agree_marketing,
        status: "pending",
      }, { onConflict: "user_id" });
      
      if (profileError) throw profileError;

      setDone(true);
    } catch (e: any) {
      alert("에러: " + e.message);
    } finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
        <div className="bg-white border border-black/5 rounded-[24px] p-8 max-w-[440px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-[20px]">✓</div>
          <h1 className="text-[22px] font-bold mt-5">신청이 완료되었습니다!</h1>
          <p className="text-[13px] opacity-60 mt-3 break-keep">관리자(phankyu@gmail.com)가 24시간 이내<br/>서류를 검토한 후 승인해드립니다.</p>
          <div className="mt-6 bg-[#fafaf8] border border-black/5 rounded-[12px] p-4 text-left text-[11px] leading-relaxed">
            <p className="font-bold">신청 정보</p><p className="opacity-60 mt-1">상호: {form.company_name} / 사업자번호: {form.business_no}</p><p className="opacity-60">이메일: {form.email}</p>
          </div>
          <div className="mt-8 space-y-3">
            <Link href="/" className="block w-full bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">홈으로 돌아가기</Link>
            <Link href="/dashboard" className="block w-full border border-black/10 rounded-full py-3.5 text-[13px] font-semibold">회원전용 상태 확인 →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[900px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div><span className="font-semibold text-[14px]">FLEX CENTER 회원가입</span></Link>
          <div className="text-[11px] opacity-50">STEP {step} / 5</div>
        </div>
      </header>
      <main className="max-w-[900px] mx-auto px-6 py-10">
        <div className="flex gap-2 mb-8">{[1,2,3,4,5].map(i=><div key={i} className={`h-[4px] flex-1 rounded-full ${i<=step?"bg-black":"bg-black/10"}`} />)}</div>
        {step===1 && (
          <div className="bg-white border border-black/5 rounded-[20px] p-7">
            <h2 className="text-[18px] font-bold">기본 계정</h2><p className="text-[12px] opacity-50 mt-1">로그인에 사용할 이메일과 비밀번호</p>
            <div className="mt-6 grid gap-4">
              <div><label className="text-[11px] font-semibold opacity-70">이메일 *</label><input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="example@naver.com" className="mt-1 w-full border border-black/10 rounded-[10px] px-4 py-3 text-[13px]" /></div>
              <div><label className="text-[11px] font-semibold opacity-70">비밀번호 * (6자 이상)</label><input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="mt-1 w-full border border-black/10 rounded-[10px] px-4 py-3 text-[13px]" /></div>
              <div><label className="text-[11px] font-semibold opacity-70">휴대폰 번호 *</label><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="010-1234-5678" className="mt-1 w-full border border-black/10 rounded-[10px] px-4 py-3 text-[13px]" /></div>
            </div>
            <button onClick={()=>{if(!form.email||!form.password) return alert("이메일, 비밀번호 필수!"); setStep(2);}} className="mt-8 w-full bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">다음 →</button>
          </div>
        )}
        {step===2 && (
          <div className="bg-white border border-black/5 rounded-[20px] p-7">
            <h2 className="text-[18px] font-bold">사업자 정보</h2>
            <div className="mt-6 grid gap-4">
              <div><label className="text-[11px] font-semibold">사업자 유형 *</label><select value={form.business_type} onChange={e=>setForm({...form, business_type:e.target.value})} className="mt-1 w-full border border-black/10 rounded-[10px] px-4 py-3 text-[13px]"><option>개인사업자</option><option>법인사업자</option><option>간이과세자</option><option>예비창업자</option></select></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-[11px] font-semibold">사업자등록번호 *</label><input value={form.business_no} onChange={e=>setForm({...form, business_no:e.target.value})} placeholder="123-45-67890" className="mt-1 w-full border rounded-[10px] px-4 py-3 text-[13px]" /></div><div><label className="text-[11px] font-semibold">상호명 *</label><input value={form.company_name} onChange={e=>setForm({...form, company_name:e.target.value})} className="mt-1 w-full border rounded-[10px] px-4 py-3 text-[13px]" /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-[11px] font-semibold">대표자명 *</label><input value={form.ceo_name} onChange={e=>setForm({...form, ceo_name:e.target.value})} className="mt-1 w-full border rounded-[10px] px-4 py-3 text-[13px]" /></div><div><label className="text-[11px] font-semibold">개업일자</label><input type="date" value={form.opening_date} onChange={e=>setForm({...form, opening_date:e.target.value})} className="mt-1 w-full border rounded-[10px] px-4 py-3 text-[13px]" /></div></div>
              <div><label className="text-[11px] font-semibold">사업장 주소 *</label><input value={form.business_address} onChange={e=>setForm({...form, business_address:e.target.value})} className="mt-1 w-full border rounded-[10px] px-4 py-3 text-[13px]" /></div>
              <div><label className="text-[11px] font-semibold">업태/업종</label><input value={form.business_category} onChange={e=>setForm({...form, business_category:e.target.value})} placeholder="도소매 / 전자상거래" className="mt-1 w-full border rounded-[10px] px-4 py-3 text-[13px]" /></div>
            </div>
            <div className="mt-8 flex gap-3"><button onClick={()=>setStep(1)} className="px-6 py-3.5 rounded-full border text-[13px]">이전</button><button onClick={()=>setStep(3)} className="flex-1 bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">다음 →</button></div>
          </div>
        )}
        {step===3 && (
          <div className="bg-white border border-black/5 rounded-[20px] p-7">
            <h2 className="text-[18px] font-bold">서류 업로드 (선택)</h2><p className="text-[11px] opacity-50 mt-1 text-red-600">※ 신분증은 주민번호 뒷자리 가림 처리 후 업로드</p>
            <div className="mt-6 grid gap-4">{[{key:"biz_license",label:"사업자등록증 사본 *"},{key:"online_sales",label:"통신판매업신고증"},{key:"id_card",label:"대표자 신분증 사본 (마스킹 필수) *"},{key:"bank_book",label:"통장사본 *"}].map(f=>(<div key={f.key} className="flex items-center justify-between border border-black/10 rounded-[12px] px-4 py-3"><span className="text-[12px] font-semibold">{f.label}</span><input type="file" onChange={e=>setFiles({...files, [f.key]: e.target.files?.[0]||null})} className="text-[11px]" /></div>))}</div>
            <div className="mt-8 flex gap-3"><button onClick={()=>setStep(2)} className="px-6 py-3.5 rounded-full border text-[13px]">이전</button><button onClick={()=>setStep(4)} className="flex-1 bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">다음 →</button></div>
          </div>
        )}
        {step===4 && (
          <div className="bg-white border border-black/5 rounded-[20px] p-7">
            <h2 className="text-[18px] font-bold">정산 및 물류 정보</h2>
            <div className="mt-6 grid gap-4">
              <div className="grid grid-cols-3 gap-3"><input placeholder="은행명" value={form.bank_name} onChange={e=>setForm({...form, bank_name:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px]" /><input placeholder="계좌번호" value={form.account_no} onChange={e=>setForm({...form, account_no:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px] col-span-2" /></div>
              <div className="grid grid-cols-2 gap-3"><input placeholder="예금주" value={form.account_holder} onChange={e=>setForm({...form, account_holder:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px]" /><input placeholder="세금계산서 이메일" value={form.tax_email} onChange={e=>setForm({...form, tax_email:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px]" /></div>
              <div className="grid grid-cols-3 gap-3"><input placeholder="SKU 수" value={form.sku_count} onChange={e=>setForm({...form, sku_count:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px]" /><input placeholder="월 주문량" value={form.monthly_orders} onChange={e=>setForm({...form, monthly_orders:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px]" /><input placeholder="보관 유형" value={form.storage_type} onChange={e=>setForm({...form, storage_type:e.target.value})} className="border rounded-[10px] px-4 py-3 text-[13px]" /></div>
              <input placeholder="판매 채널 (콤마로 구분)" value={form.sales_channels} onChange={e=>setForm({...form, sales_channels:e.target.value})} className="w-full border rounded-[10px] px-4 py-3 text-[13px]" />
              <textarea placeholder="특이사항" value={form.special_note} onChange={e=>setForm({...form, special_note:e.target.value})} className="w-full border rounded-[10px] px-4 py-3 text-[13px] h-[80px]" />
            </div>
            <div className="mt-8 flex gap-3"><button onClick={()=>setStep(3)} className="px-6 py-3.5 rounded-full border text-[13px]">이전</button><button onClick={()=>setStep(5)} className="flex-1 bg-black text-white rounded-full py-3.5 text-[13px] font-semibold">다음 →</button></div>
          </div>
        )}
        {step===5 && (
          <div className="bg-white border border-black/5 rounded-[20px] p-7">
            <h2 className="text-[18px] font-bold">약관 동의 및 최종 제출</h2>
            <div className="mt-6 space-y-3 text-[12px]">
              <label className="flex gap-2 p-3 border rounded-[12px] cursor-pointer"><input type="checkbox" checked={form.agree_terms} onChange={e=>setForm({...form, agree_terms:e.target.checked})} /> <span>[필수] <Link href="/terms" className="underline">풀필먼트 이용약관</Link> 동의</span></label>
              <label className="flex gap-2 p-3 border rounded-[12px] cursor-pointer"><input type="checkbox" checked={form.agree_privacy} onChange={e=>setForm({...form, agree_privacy:e.target.checked})} /> <span>[필수] <Link href="/privacy" className="underline">개인정보처리방침</Link> 동의</span></label>
              <label className="flex gap-2 p-3 border border-amber-200 bg-amber-50 rounded-[12px] cursor-pointer"><input type="checkbox" checked={form.agree_privacy_collect} onChange={e=>setForm({...form, agree_privacy_collect:e.target.checked})} /> <span>[필수] 민감정보 수집·이용 동의</span></label>
              <label className="flex gap-2 p-3 border rounded-[12px] cursor-pointer"><input type="checkbox" checked={form.agree_marketing} onChange={e=>setForm({...form, agree_marketing:e.target.checked})} /> <span>[선택] 마케팅 정보 수신 동의</span></label>
            </div>
            <div className="mt-8 flex gap-3"><button onClick={()=>setStep(4)} className="px-6 py-3.5 rounded-full border text-[13px]">이전</button><button disabled={loading} onClick={handleSubmit} className="flex-1 bg-black text-white rounded-full py-3.5 text-[13px] font-bold disabled:opacity-50">{loading ? "제출 중..." : "회원가입 신청하기 →"}</button></div>
          </div>
        )}
      </main>
    </div>
  );
}

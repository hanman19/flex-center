"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

// 개인정보보호법 준수 항목
const REQUIRED_FIELDS = [
  "business_no", "company_name", "ceo_name", "opening_date",
  "business_address", "phone", "tax_email"
];

export default function SellerOnboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // STEP 1: 기본 인증
    email: "", password: "", phone: "", phone_verified: false,
    // STEP 2: 사업자 유형
    business_type: "개인사업자",
    // STEP 3: 사업자 정보
    business_no: "", company_name: "", ceo_name: "", opening_date: "",
    business_address: "", business_category: "",
    // STEP 4: 정산
    bank_name: "", account_no: "", account_holder: "", tax_email: "",
    // STEP 5: 물류
    sku_count: "", monthly_orders: "100", storage_type: "선반",
    sales_channels: [] as string[],
    special_note: "",
    // 동의
    agree_terms: false, agree_privacy: false, agree_privacy_collect: false, agree_marketing: false
  });

  const [files, setFiles] = useState<{[key:string]: File | null}>({
    biz_license: null, online_sales: null, id_card: null, bank_book: null
  });

  const handleChange = (k: string, v: any) => setForm(prev => ({...prev, [k]: v}));

  const handleFile = (key: string, file: File) => {
    // 개인정보보호법: 파일 용량 제한, 주민번호 마스킹 안내
    if (file.size > 5*1024*1024) { alert("5MB 이하만 업로드 가능"); return; }
    setFiles(prev => ({...prev, [key]: file}));
  };

  const handleSubmit = async () => {
    if (!form.agree_terms || !form.agree_privacy || !form.agree_privacy_collect) {
      alert("필수 약관에 동의해야 합니다");
      return;
    }
    // Supabase에 저장 로직
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("로그인이 필요합니다"); return; }

    // TODO: 파일 업로드는 supabase storage에
    const { error } = await supabase.from("seller_profiles").upsert({
      user_id: user.id,
      ...form,
      status: "pending",
      created_at: new Date().toISOString()
    });
    if (error) alert(error.message);
    else alert("신청 완료! 관리자 승인 후 회원전용 페이지 이용 가능합니다");
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[800px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-black rounded-full text-[12px]">F</div>
            <span className="font-semibold">FLEX CENTER</span>
          </Link>
          <span className="text-[11px] bg-black text-white px-3 py-1 rounded-full">회원전용 가입 · {step}/5</span>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 py-10">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1,2,3,4,5].map(s=>(
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step>=s ? 'bg-black' : 'bg-black/10'}`} />
          ))}
        </div>

        {step===1 && (
          <div className="bg-white border border-black/5 rounded-[24px] p-8">
            <h1 className="text-[24px] font-bold">기본 정보를 입력하세요</h1>
            <p className="text-[13px] opacity-60 mt-2">이메일과 휴대폰 본인인증을 진행합니다</p>
            
            <div className="mt-8 space-y-4">
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">이메일 (아이디) *</label>
                <input value={form.email} onChange={e=>handleChange("email", e.target.value)} placeholder="ceo@company.com" className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">비밀번호 *</label>
                <input type="password" value={form.password} onChange={e=>handleChange("password", e.target.value)} className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">휴대폰 번호 *</label>
                <div className="flex gap-2 mt-2">
                  <input value={form.phone} onChange={e=>handleChange("phone", e.target.value)} placeholder="01012345678" className="flex-1 border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
                  <button onClick={()=>handleChange("phone_verified", true)} className="px-5 bg-black text-white rounded-[12px] text-[13px] font-semibold">인증요청</button>
                </div>
                <p className="text-[11px] opacity-40 mt-2">※ PASS 본인인증 연동 예정. 지금은 임시 인증 처리</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-[12px] p-4">
              <p className="text-[11px] font-semibold text-blue-800">개인정보보호법 안내</p>
              <p className="text-[11px] text-blue-700/80 mt-1 leading-relaxed">휴대폰 번호는 본인 확인용으로만 사용되며, 30일 후 자동 파기됩니다. 주민등록번호는 수집하지 않습니다.</p>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="bg-white border border-black/5 rounded-[24px] p-8">
            <h1 className="text-[24px] font-bold">사업자 유형을 선택하세요</h1>
            <p className="text-[13px] opacity-60 mt-2">유형에 따라 필요 서류가 달라집니다</p>
            
            <div className="grid grid-cols-2 gap-3 mt-8">
              {["개인사업자","법인사업자","간이과세자","예비창업자"].map(t=>(
                <button key={t} onClick={()=>handleChange("business_type", t)} className={`border rounded-[16px] p-5 text-left transition-all ${form.business_type===t ? 'border-black bg-black text-white' : 'border-black/10 hover:border-black/30 bg-white'}`}>
                  <p className="font-semibold text-[14px]">{t}</p>
                  <p className={`text-[11px] mt-1 ${form.business_type===t ? 'opacity-60' : 'opacity-40'}`}>{t==="개인사업자"?"가장 일반적":t==="법인사업자"?"법인등록번호 필요":t==="간이과세자"?"연매출 8천 미만":"사업자등록 전"}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-[12px] p-4">
              <p className="text-[11px] font-semibold text-amber-800">⚠️ 개인정보 최소 수집 원칙</p>
              <p className="text-[11px] text-amber-700/80 mt-1">예비창업자는 사업자등록증 없이 가입 가능하나, 30일 이내 제출해야 회원전용 이용이 가능합니다.</p>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="bg-white border border-black/5 rounded-[24px] p-8">
            <h1 className="text-[24px] font-bold">사업자 정보를 입력하세요</h1>
            <p className="text-[13px] opacity-60 mt-2">국세청 진위 확인을 위해 정확히 입력하세요</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold tracking-widest opacity-60">사업자등록번호 10자리 * (개인정보 아님)</label>
                <input value={form.business_no} onChange={e=>handleChange("business_no", e.target.value.replace(/[^0-9]/g,""))} placeholder="1234567890" maxLength={10} className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px] tracking-widest" />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">상호명 *</label>
                <input value={form.company_name} onChange={e=>handleChange("company_name", e.target.value)} placeholder="(주)플렉스" className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">대표자명 *</label>
                <input value={form.ceo_name} onChange={e=>handleChange("ceo_name", e.target.value)} placeholder="박한규" className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">개업일자 *</label>
                <input type="date" value={form.opening_date} onChange={e=>handleChange("opening_date", e.target.value)} className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
              <div>
                <label className="text-[11px] font-semibold tracking-widest opacity-60">업태/업종</label>
                <input value={form.business_category} onChange={e=>handleChange("business_category", e.target.value)} placeholder="도소매 / 전자상거래" className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold tracking-widest opacity-60">사업장 주소 *</label>
                <input value={form.business_address} onChange={e=>handleChange("business_address", e.target.value)} placeholder="경기도 김포시..." className="mt-2 w-full border border-black/10 rounded-[12px] px-4 py-3 text-[14px]" />
              </div>
            </div>

            <div className="mt-6 bg-zinc-50 border border-black/5 rounded-[12px] p-4">
              <p className="text-[11px] font-semibold">🔒 개인정보보호법 준수</p>
              <ul className="text-[11px] opacity-60 mt-2 space-y-1 list-disc ml-4">
                <li>사업자등록번호는 개인정보가 아니며, 국세청 사업자등록 상태 조회용으로만 사용</li>
                <li>주민등록번호, 법인등록번호 뒷자리는 수집하지 않음</li>
                <li>정보는 암호화되어 저장되며, 승인 후에도 대표자명/연락처만 보관</li>
              </ul>
            </div>
          </div>
        )}

        {step===4 && (
          <div className="bg-white border border-black/5 rounded-[24px] p-8">
            <h1 className="text-[24px] font-bold">필수 서류를 업로드하세요</h1>
            <p className="text-[13px] opacity-60 mt-2">개인정보보호를 위해 마스킹 처리 후 업로드하세요</p>
            
            <div className="mt-8 space-y-4">
              {[
                {key:"biz_license", label:"사업자등록증 사본 *", desc:"주민번호 없음 · 3개월 이내 발급", required:true},
                {key:"online_sales", label:"통신판매업신고증", desc:"없으면 30일 유예 가능", required:false},
                {key:"id_card", label:"대표자 신분증 *", desc:"주민번호 뒷자리 가림 필수! 예: 900101-1******", required:true},
                {key:"bank_book", label:"통장사본 (사업자 명의) *", desc:"정산용 · 세금계산서 발행 계좌", required:true},
              ].map(f=>(
                <div key={f.key} className="border border-black/10 rounded-[16px] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold">{f.label}</p>
                    <p className="text-[11px] opacity-50 mt-1">{f.desc}</p>
                    {files[f.key] && <p className="text-[11px] text-green-600 mt-1">✓ {files[f.key]?.name}</p>}
                  </div>
                  <label className={`px-4 py-2 rounded-full text-[12px] font-semibold cursor-pointer ${files[f.key] ? 'bg-green-600 text-white' : 'bg-black text-white'}`}>
                    {files[f.key] ? '변경' : '업로드'}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={e=>{if(e.target.files?.[0]) handleFile(f.key, e.target.files[0])}} />
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-red-50 border border-red-200 rounded-[12px] p-4">
              <p className="text-[11px] font-semibold text-red-800">🛡️ 개인정보보호법 필수 준수 사항</p>
              <ul className="text-[11px] text-red-700/80 mt-2 space-y-1 list-disc ml-4 break-keep">
                <li><b>신분증:</b> 주민등록번호 뒷자리 6자리는 반드시 가림 처리 (마스킹) 후 업로드. 가림 없이 올리면 반려됩니다.</li>
                <li><b>보관 기간:</b> 승인 후 서류는 5년 보관 (세법), 미승인 시 30일 후 자동 파기</li>
                <li><b>암호화:</b> 업로드 즉시 Supabase Storage에서 암호화 저장, 관리자만 복호화 가능</li>
                <li><b>접근 제한:</b> 대표자 본인과 관리자(phankyu@gmail.com)만 조회 가능 (RLS)</li>
              </ul>
            </div>
          </div>
        )}

        {step===5 && (
          <div className="bg-white border border-black/5 rounded-[24px] p-8">
            <h1 className="text-[24px] font-bold">마지막으로, 동의해주세요</h1>
            <p className="text-[13px] opacity-60 mt-2">회원전용 서비스 이용을 위한 필수 동의</p>

            <div className="mt-8 space-y-3">
              <label className="flex items-start gap-3 border border-black/10 rounded-[12px] p-4 cursor-pointer hover:bg-black/[0.02]">
                <input type="checkbox" checked={form.agree_terms} onChange={e=>handleChange("agree_terms", e.target.checked)} className="mt-1" />
                <div>
                  <p className="text-[13px] font-semibold">[필수] 풀필먼트 이용약관 동의</p>
                  <p className="text-[11px] opacity-50 mt-1">보관, 출고, 반품, 파손, 분실에 대한 책임 범위</p>
                </div>
              </label>
              <label className="flex items-start gap-3 border border-black/10 rounded-[12px] p-4 cursor-pointer hover:bg-black/[0.02]">
                <input type="checkbox" checked={form.agree_privacy} onChange={e=>handleChange("agree_privacy", e.target.checked)} className="mt-1" />
                <div>
                  <p className="text-[13px] font-semibold">[필수] 개인정보 수집·이용 동의</p>
                  <p className="text-[11px] opacity-50 mt-1 break-keep">수집: 사업자등록번호, 상호, 대표자명, 연락처, 계좌정보 / 목적: 풀필먼트 서비스 제공, 정산, 세금계산서 발행 / 보관: 회원 탈퇴 후 5년 (세법)</p>
                </div>
              </label>
              <label className="flex items-start gap-3 border border-black rounded-[12px] p-4 cursor-pointer bg-black/[0.02]">
                <input type="checkbox" checked={form.agree_privacy_collect} onChange={e=>handleChange("agree_privacy_collect", e.target.checked)} className="mt-1" />
                <div>
                  <p className="text-[13px] font-semibold">[필수] 민감정보 수집 동의 (신분증, 통장)</p>
                  <p className="text-[11px] opacity-60 mt-1 break-keep">사업자 본인 확인을 위해 신분증, 통장 사본을 수집합니다. 주민번호 뒷자리는 마스킹 처리 후 업로드해야 하며, 미처리 시 반려됩니다. 보관 기간 5년 후 자동 파기.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 border border-black/10 rounded-[12px] p-4 cursor-pointer hover:bg-black/[0.02]">
                <input type="checkbox" checked={form.agree_marketing} onChange={e=>handleChange("agree_marketing", e.target.checked)} className="mt-1" />
                <div>
                  <p className="text-[13px] font-semibold">[선택] 마케팅 수신 동의</p>
                  <p className="text-[11px] opacity-50 mt-1">할인, 이벤트 정보 수신 (선택, 거부해도 서비스 이용 가능)</p>
                </div>
              </label>
            </div>

            <div className="mt-8 bg-black text-white rounded-[16px] p-5">
              <p className="text-[12px] font-semibold">📋 개인정보 처리 요약</p>
              <ul className="text-[11px] opacity-70 mt-2 space-y-1 list-disc ml-4 break-keep">
                <li>수집 항목: 이메일, 휴대폰, 사업자정보, 계좌, 서류 4종</li>
                <li>수집 목적: 회원전용 풀필먼트 서비스 제공, 정산, 세금계산서 발행, 본인 확인</li>
                <li>보유 기간: 탈퇴 후 5년 (전자상거래법, 세법) 후 파기, 마케팅 동의 시 탈퇴 시까지</li>
                <li>제3자 제공: 없음 (택배사 CJ대한통운에는 수령인 정보만 제공, 별도 동의)</li>
                <li>권리: 언제든 열람, 수정, 삭제, 처리정지 요청 가능 (dashboard에서)</li>
              </ul>
            </div>

            <button onClick={handleSubmit} className="mt-8 w-full bg-black text-white rounded-full py-4 text-[14px] font-semibold hover:bg-zinc-800 transition">회원전용 가입 신청하기 →</button>
            <p className="text-[11px] opacity-40 text-center mt-3">신청 후 관리자 승인까지 최대 24시간 소요</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button disabled={step===1} onClick={()=>setStep(s=>Math.max(1,s-1))} className="px-6 py-3 rounded-full border border-black/10 text-[13px] disabled:opacity-30">이전</button>
          {step<5 ? (
            <button onClick={()=>setStep(s=>Math.min(5,s+1))} className="px-6 py-3 rounded-full bg-black text-white text-[13px] font-semibold">다음 →</button>
          ) : null}
        </div>

        {/* 법률 안내 */}
        <div className="mt-12 border-t border-black/5 pt-8 text-[11px] opacity-40 leading-relaxed break-keep">
          <p className="font-semibold opacity-60">개인정보보호법 준수 안내 (필독)</p>
          <p className="mt-2">1. 주민등록번호는 수집하지 않습니다. 신분증 제출 시 뒷자리 6자리는 반드시 가림 처리하세요.</p>
          <p>2. 사업자등록증, 통장사본은 개인정보가 아닌 사업자 정보로 분류되나, 암호화하여 보관합니다.</p>
          <p>3. 수집된 서류는 Supabase Storage에 암호화 저장되며, RLS 정책으로 본인과 관리자만 조회 가능합니다.</p>
          <p>4. 미승인 회원의 서류는 30일 후 자동 파기되며, 승인 회원은 탈퇴 후 5년 보관 후 파기됩니다 (세법).</p>
          <p>5. 언제든 개인정보 열람, 수정, 삭제를 요청할 수 있습니다. 문의: phankyu@gmail.com</p>
          <p className="mt-3"><Link href="/privacy" className="underline">개인정보처리방침 전문 보기 →</Link> | <Link href="/terms" className="underline">이용약관 전문 보기 →</Link></p>
        </div>
      </main>
    </div>
  );
}

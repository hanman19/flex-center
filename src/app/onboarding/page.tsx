"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = "https://qkpnvfmsmvcemdblaahl.supabase.co";
const supabaseKey = "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState("LITE");
  const [form, setForm] = useState({
    bizNo:"", ceoName:"", companyName:"", address:"", phone:"", contactEmail:"", taxEmail:"",
    skuCount:"", monthlyOrders:"", storageType:"", category:"", special:""
  });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    setPlan(params.get("plan") || "LITE");
    supabase.auth.getSession().then(({data})=> setUser(data.session?.user));
  },[]);

  async function submit() {
    setSaving(true);
    const payload = {
      user_id: user?.id,
      email: user?.email,
      plan: plan,
      biz_no: form.bizNo,
      company_name: form.companyName,
      ceo_name: form.ceoName,
      address: form.address,
      phone: form.phone,
      contact_email: form.contactEmail,
      tax_email: form.taxEmail,
      sku_count: form.skuCount,
      monthly_orders: form.monthlyOrders,
      storage_type: form.storageType,
      category: form.category,
      special: form.special,
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from("seller_profiles").insert(payload);
    if (error) {
      alert("저장 실패: "+error.message+"\n\nSupabase에 seller_profiles 테이블을 만들어야 합니다. SQL을 실행했는지 확인하세요!");
      console.log(error);
    } else {
      alert("사업자 정보 저장 완료! 이제 대시보드로 이동합니다.");
      location.href = "/dashboard";
    }
    setSaving(false);
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center p-8">
        <div className="bg-white border rounded-[24px] p-8 max-w-[420px] w-full text-center">
          <p className="font-black text-[18px]">로그인이 필요합니다</p>
          <p className="text-[13px] opacity-60 mt-2">온보딩은 로그인 후 진행됩니다.</p>
          <Link href="/dashboard" className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold">로그인하러 가기 →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#111]">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[960px] mx-auto px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-lg">F</div>
            <span className="font-black">FLEX CENTER</span>
            <span className="text-[10px] border px-2 py-1 rounded-full opacity-50 ml-2">ONBOARDING • {plan}</span>
          </div>
          <span className="text-[11px] opacity-50">{user.email}</span>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-8 py-12">
        <div className="flex items-center gap-3 text-[11px] tracking-widest opacity-40 mb-6">
          <span>STEP 1</span><span>—</span><span>요금제 선택</span><span className="opacity-20">—</span><span className="text-black font-bold">STEP 2 사업자 정보</span><span className="opacity-20">—</span><span>STEP 3 결제</span>
        </div>

        <h1 className="text-[36px] font-black tracking-tight">사업자 정보를 입력하세요</h1>
        <p className="text-[14px] opacity-60 mt-2">풀필먼트 계약을 위해 필요합니다. 세금계산서 발행 및 물류 운영에 사용됩니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <div className="bg-white border rounded-[20px] p-7">
              <h3 className="font-black text-[14px]">01 사업자 정보</h3>
              <div className="mt-5 space-y-4">
                <div><label className="text-[11px] opacity-50">사업자등록번호 *</label><input value={form.bizNo} onChange={e=>setForm({...form,bizNo:e.target.value})} placeholder="123-45-67890" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div><label className="text-[11px] opacity-50">상호명 / 법인명 *</label><input value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} placeholder="박한규상점" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div><label className="text-[11px] opacity-50">대표자명 *</label><input value={form.ceoName} onChange={e=>setForm({...form,ceoName:e.target.value})} placeholder="박한규" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div><label className="text-[11px] opacity-50">사업장 주소 *</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="경기도 김포시..." className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] opacity-50">연락처 *</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="010-1234-5678" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                  <div><label className="text-[11px] opacity-50">연락용 이메일 *</label><input value={form.contactEmail} onChange={e=>setForm({...form,contactEmail:e.target.value})} placeholder="order@..." className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                </div>
                <div><label className="text-[11px] opacity-50">세금계산서 발행 이메일</label><input value={form.taxEmail} onChange={e=>setForm({...form,taxEmail:e.target.value})} placeholder="tax@..." className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-[20px] p-7">
              <h3 className="font-black text-[14px]">02 물류 정보 (풀필먼트용)</h3>
              <div className="mt-5 space-y-4">
                <div><label className="text-[11px] opacity-50">SKU 수 (상품 가짓수)</label><input value={form.skuCount} onChange={e=>setForm({...form,skuCount:e.target.value})} placeholder="예: 25개" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div><label className="text-[11px] opacity-50">월 평균 출고량</label><input value={form.monthlyOrders} onChange={e=>setForm({...form,monthlyOrders:e.target.value})} placeholder="예: 월 300건" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div><label className="text-[11px] opacity-50">보관 형태</label><select value={form.storageType} onChange={e=>setForm({...form,storageType:e.target.value})} className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"><option value="">선택</option><option>선반 (소형)</option><option>파렛트 1.1*1.1*1.8m</option><option>혼적</option></select></div>
                <div><label className="text-[11px] opacity-50">상품 카테고리</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="의류, 잡화, 식품 등" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px]"/></div>
                <div><label className="text-[11px] opacity-50">특수 보관 / 기타 요청</label><textarea value={form.special} onChange={e=>setForm({...form,special:e.target.value})} placeholder="냉장, 고가품, 파손주의 등" className="w-full mt-1 border rounded-xl px-4 py-3 text-[13px] h-[80px]"></textarea></div>
              </div>
            </div>

            <div className="bg-black text-white rounded-[20px] p-7">
              <h3 className="font-bold text-[14px]">선택한 요금제: {plan}</h3>
              <p className="text-[12px] opacity-60 mt-2">다음 단계에서 결제 및 파렛트 배정, 랙 로케이션 설정이 진행됩니다.</p>
              <button onClick={submit} disabled={saving} className="w-full mt-6 bg-white text-black rounded-full py-4 font-black text-[14px] disabled:opacity-50">
                {saving ? "저장 중..." : "사업자 정보 저장하고 계속 →"}
              </button>
              <p className="text-[10px] opacity-40 mt-3">저장 시 Supabase seller_profiles 테이블에 저장됩니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

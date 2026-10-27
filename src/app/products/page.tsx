"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

type Product = {
  id: string;
  sku: string;
  barcode: string;
  product_name: string;
  category: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  price: number;
  stock: number;
  location: string;
  image?: string;
  seller_id?: string;
};

type Bundle = {
  id: string;
  bundle_sku: string;
  bundle_name: string;
  components: { sku: string; qty: number; product_name: string }[];
  price: number;
};

const mockProducts: Product[] = [
  { id: "1", sku: "EAR-001", barcode: "880123456001", product_name: "무선 이어폰 Pro", category: "전자기기", weight: 0.15, width: 10, height: 8, depth: 4, price: 59000, stock: 150, location: "A-01-02" },
  { id: "2", sku: "WATCH-02", barcode: "880123456002", product_name: "스마트 워치", category: "전자기기", weight: 0.2, width: 12, height: 12, depth: 6, price: 129000, stock: 45, location: "B-02-05" },
  { id: "3", sku: "CASE-04", barcode: "880123456003", product_name: "에어팟 케이스", category: "액세서리", weight: 0.05, width: 6, height: 6, depth: 3, price: 15000, stock: 320, location: "A-01-03" },
  { id: "4", sku: "COS-001", barcode: "880123456004", product_name: "에센스 100ml", category: "화장품", weight: 0.3, width: 8, height: 15, depth: 8, price: 45000, stock: 200, location: "A-02-01" },
  { id: "5", sku: "KPOP-001", barcode: "880123456005", product_name: "K-pop 앨범 (포토카드 포함)", category: "K-pop 굿즈", weight: 0.4, width: 20, height: 20, depth: 2, price: 25000, stock: 100, location: "A-03-01" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [bundles, setBundles] = useState<Bundle[]>([
    { id: "1", bundle_sku: "SET-001", bundle_name: "이어폰 + 케이스 세트", components: [{ sku: "EAR-001", qty: 1, product_name: "무선 이어폰 Pro" }, { sku: "CASE-04", qty: 1, product_name: "에어팟 케이스" }], price: 69000 },
  ]);
  const [tab, setTab] = useState<"list" | "add" | "bundle" | "upload">("list");
  const [form, setForm] = useState<Partial<Product>>({ sku: "", barcode: "", product_name: "", category: "전자기기", weight: 0.15, width: 10, height: 8, depth: 4, price: 0, stock: 0, location: "" });
  const [bundleForm, setBundleForm] = useState({ bundle_sku: "", bundle_name: "", price: 0, components: [] as any[] });
  const [selectedSkus, setSelectedSkus] = useState<{ sku: string; qty: number }[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      try {
        const { data } = await supabase.from("products").select("*").eq("seller_id", s?.user?.id);
        if (data && data.length > 0) setProducts(data);
      } catch(e) {}
    };
    load();
  }, []);

  const handleAddProduct = () => {
    if (!form.sku || !form.product_name) { alert("SKU와 상품명은 필수!"); return; }
    const newProduct: Product = { id: Date.now().toString(), sku: form.sku!, barcode: form.barcode || "", product_name: form.product_name!, category: form.category || "전자기기", weight: form.weight || 0, width: form.width || 0, height: form.height || 0, depth: form.depth || 0, price: form.price || 0, stock: form.stock || 0, location: form.location || "" };
    setProducts([...products, newProduct]);
    setForm({ sku: "", barcode: "", product_name: "", category: "전자기기", weight: 0.15, width: 10, height: 8, depth: 4, price: 0, stock: 0, location: "" });
    setTab("list");
    alert(`상품 등록 완료! ${newProduct.product_name}\n이제 WMS에서 ${newProduct.location}에서 피킹 가능!`);
  };

  const handleCreateBundle = () => {
    if (selectedSkus.length < 2) { alert("세트 상품은 2개 이상 상품을 선택해야 해요!"); return; }
    if (!bundleForm.bundle_sku || !bundleForm.bundle_name) { alert("세트 SKU와 세트명은 필수!"); return; }
    const components = selectedSkus.map(s => {
      const p = products.find(prod => prod.sku === s.sku);
      return { sku: s.sku, qty: s.qty, product_name: p?.product_name || s.sku };
    });
    const newBundle: Bundle = { id: Date.now().toString(), bundle_sku: bundleForm.bundle_sku, bundle_name: bundleForm.bundle_name, components, price: bundleForm.price };
    setBundles([...bundles, newBundle]);
    setBundleForm({ bundle_sku: "", bundle_name: "", price: 0, components: [] });
    setSelectedSkus([]);
    alert(`세트 상품 생성 완료! ${newBundle.bundle_name}\n구성: ${components.map(c=>`${c.product_name} x${c.qty}`).join(", ")}\nWMS에서 세트 주문 들어오면 자동으로 구성품 피킹!`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-40 ml-2">상품 마스터 - 기초 공사</span><span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">PHASE 1</span></Link>
          <div className="flex gap-2"><Link href="/wms" className="text-[12px] px-4 py-2 rounded-full border">내 창고 WMS</Link><Link href="/admin/wms" className="text-[12px] px-4 py-2 rounded-full bg-black text-white">작업자 WMS Pro</Link><Link href="/orders" className="text-[12px] px-4 py-2 rounded-full border">주문관리</Link></div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-start justify-between">
          <div><h1 className="text-[28px] font-bold tracking-tight">상품 마스터 (Product Master)</h1><p className="text-[13px] opacity-60 mt-1">사방넷처럼! 상품 정보 한 번 입력하면 WMS, 샘플, 세트, 플랫폼 업로드까지 다 연결!</p></div>
          <div className="bg-black text-white rounded-[12px] px-4 py-2 text-[11px]">총 {products.length}개 SKU / {bundles.length}개 세트</div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={()=>setTab("list")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="list" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>내 상품 목록 ({products.length})</button>
          <button onClick={()=>setTab("add")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="add" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>+ 상품 등록</button>
          <button onClick={()=>setTab("bundle")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="bundle" ? "bg-amber-400 text-black border-amber-400" : "bg-white border-black/10"}`}>세트 상품 만들기 ({bundles.length})</button>
          <button onClick={()=>setTab("upload")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="upload" ? "bg-black text-white border-black" : "bg-white border-black/10"}`}>플랫폼 업로드 (사방넷)</button>
        </div>

        {tab==="list" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between"><h3 className="font-bold text-[14px]">내 상품 마스터 - WMS, 샘플, 세트, 플랫폼 업로드의 기초!</h3><span className="text-[11px] opacity-50">이 정보로 박스 추천, 바코드 스캔, 피킹 다 됨!</span></div>
            <table className="w-full text-[12px]">
              <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b border-black/5"><tr><th className="text-left py-3 px-6">SKU / 바코드 / 상품명</th><th className="text-center">카테고리</th><th className="text-center">무게 / 크기</th><th className="text-center">가격 / 재고</th><th className="text-center">선반 위치</th><th className="text-center">액션</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-black/[0.03] hover:bg-[#fafaf8]">
                    <td className="py-4 px-6"><p className="font-mono font-bold text-[11px] bg-black text-white px-2 py-0.5 rounded-full inline-block">{p.sku}</p><p className="font-mono text-[10px] opacity-40 mt-1">{p.barcode}</p><p className="font-bold text-[13px] mt-1">{p.product_name}</p></td>
                    <td className="text-center"><span className={`text-[10px] px-2 py-1 rounded-full font-bold ${p.category==="화장품" ? "bg-pink-100 text-pink-700" : p.category==="K-pop 굿즈" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{p.category}</span></td>
                    <td className="text-center"><p className="font-mono">{p.weight}kg</p><p className="text-[10px] opacity-50">{p.width}x{p.height}x{p.depth}mm</p></td>
                    <td className="text-center"><p className="font-bold">{p.price.toLocaleString()}원</p><p className={`text-[11px] ${p.stock < 50 ? "text-red-500 font-bold" : "opacity-60"}`}>{p.stock}개 {p.stock < 50 && "(부족!)"}</p></td>
                    <td className="text-center"><span className="font-mono bg-black text-white px-2 py-1 rounded text-[11px]">{p.location}</span></td>
                    <td className="text-center"><button className="text-[10px] px-2 py-1 rounded-full border">수정</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-[#fafaf8] text-[11px] opacity-60"><p>💡 <b>이 정보가 기초 공사!</b> 이 정보로: WMS에서 박스 추천 ({`무게+크기로 계산`}), 바코드 스캔 (바코드로 스캔), 선반 피킹 (선반 위치로 피킹), 샘플 증정 (상품 기반 룰), 세트 상품 (상품 묶기), 플랫폼 업로드 (상품 정보로 업로드)까지 다 됨!</p></div>
          </div>
        )}

        {tab==="add" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
            <h3 className="font-bold text-[16px]">상품 등록 - 기초 공사! 이 정보로 모든 게 돌아가요!</h3>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><label className="text-[11px] font-bold opacity-60">SKU (필수) - WMS 피킹에서 사용</label><input value={form.sku} onChange={e=>setForm({...form, sku: e.target.value.toUpperCase()})} placeholder="예: EAR-001" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] font-mono" /></div>
                <div><label className="text-[11px] font-bold opacity-60">바코드 (필수) - PDA, 핸드폰 카메라로 스캔</label><input value={form.barcode} onChange={e=>setForm({...form, barcode: e.target.value})} placeholder="예: 8801234567890" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] font-mono" /></div>
                <div><label className="text-[11px] font-bold opacity-60">상품명 (필수)</label><input value={form.product_name} onChange={e=>setForm({...form, product_name: e.target.value})} placeholder="예: 무선 이어폰 Pro" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
                <div><label className="text-[11px] font-bold opacity-60">카테고리</label><select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]"><option>전자기기</option><option>액세서리</option><option>화장품</option><option>K-pop 굿즈</option><option>의류</option><option>식품</option></select></div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] font-bold opacity-60">무게 (kg) - 박스 추천에 사용</label><input type="number" step="0.01" value={form.weight} onChange={e=>setForm({...form, weight: parseFloat(e.target.value) || 0})} className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold opacity-60">가격 (원)</label><input type="number" value={form.price} onChange={e=>setForm({...form, price: parseInt(e.target.value) || 0})} className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="text-[11px] font-bold opacity-60">가로 (mm)</label><input type="number" value={form.width} onChange={e=>setForm({...form, width: parseInt(e.target.value) || 0})} className="mt-1 w-full border border-black/10 rounded-[8px] px-3 py-2 text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold opacity-60">세로 (mm)</label><input type="number" value={form.height} onChange={e=>setForm({...form, height: parseInt(e.target.value) || 0})} className="mt-1 w-full border border-black/10 rounded-[8px] px-3 py-2 text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold opacity-60">높이 (mm)</label><input type="number" value={form.depth} onChange={e=>setForm({...form, depth: parseInt(e.target.value) || 0})} className="mt-1 w-full border border-black/10 rounded-[8px] px-3 py-2 text-[13px]" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] font-bold opacity-60">재고 (개)</label><input type="number" value={form.stock} onChange={e=>setForm({...form, stock: parseInt(e.target.value) || 0})} className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold opacity-60">선반 위치 - WMS 피킹 위치</label><input value={form.location} onChange={e=>setForm({...form, location: e.target.value.toUpperCase()})} placeholder="예: A-01-02" className="mt-1 w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] font-mono" /></div>
                </div>
                <div className="bg-[#fafaf8] rounded-[8px] p-3 text-[11px] opacity-60"><p>💡 <b>이 정보로:</b> 박스 추천 (무게+크기), 바코드 스캔 (바코드), 피킹 위치 (선반), 재고 관리 (재고), 샘플/세트 (SKU) 다 됨!</p></div>
              </div>
            </div>
            <div className="mt-6 flex gap-2"><button onClick={handleAddProduct} className="bg-black text-white px-8 py-3 rounded-full text-[13px] font-bold">상품 등록 - 기초 공사 완료!</button><button onClick={()=>setTab("list")} className="border border-black/10 px-6 py-3 rounded-full text-[13px]">취소</button></div>
          </div>
        )}

        {tab==="bundle" && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-black/5 rounded-[16px] p-6">
              <h3 className="font-bold text-[14px]">세트 상품 만들기 - 여러 상품을 1개로 패키지화! (사방넷 기능!)</h3>
              <p className="text-[11px] opacity-50 mt-1">예: 이어폰 + 케이스 = 세트 상품! K-pop 앨범 + 포토카드 + 포스터 = 세트!</p>
              <div className="mt-4 space-y-3">
                <input value={bundleForm.bundle_sku} onChange={e=>setBundleForm({...bundleForm, bundle_sku: e.target.value.toUpperCase()})} placeholder="세트 SKU 예: SET-001" className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] font-mono" />
                <input value={bundleForm.bundle_name} onChange={e=>setBundleForm({...bundleForm, bundle_name: e.target.value})} placeholder="세트명 예: 이어폰 + 케이스 세트" className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
                <input type="number" value={bundleForm.price} onChange={e=>setBundleForm({...bundleForm, price: parseInt(e.target.value) || 0})} placeholder="세트 가격 예: 69000" className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
                <div className="bg-[#fafaf8] rounded-[12px] p-4">
                  <p className="text-[11px] font-bold">구성품 선택 (2개 이상)</p>
                  <div className="mt-2 space-y-2 max-h-[200px] overflow-auto">
                    {products.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-white border border-black/5 rounded-[8px] px-3 py-2">
                        <div><p className="font-bold text-[12px]">{p.product_name}</p><p className="font-mono text-[10px] opacity-50">{p.sku} - {p.stock}개 보유</p></div>
                        <div className="flex items-center gap-2">
                          <input type="number" min="1" defaultValue="1" id={`qty-${p.sku}`} className="w-[50px] border rounded px-2 py-1 text-[11px]" />
                          <button onClick={()=>{
                            const qty = parseInt((document.getElementById(`qty-${p.sku}`) as HTMLInputElement)?.value || "1");
                            if (selectedSkus.find(s=>s.sku===p.sku)) setSelectedSkus(selectedSkus.filter(s=>s.sku!==p.sku));
                            else setSelectedSkus([...selectedSkus, { sku: p.sku, qty }]);
                          }} className={`px-3 py-1 rounded-full text-[11px] font-bold ${selectedSkus.find(s=>s.sku===p.sku) ? "bg-black text-white" : "bg-black/10"}`}>{selectedSkus.find(s=>s.sku===p.sku) ? "선택됨" : "선택"}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] opacity-50 mt-2">선택됨: {selectedSkus.map(s=>`${s.sku} x${s.qty}`).join(", ") || "없음"}</p>
                </div>
                <button onClick={handleCreateBundle} className="w-full bg-amber-400 text-black py-3 rounded-full text-[13px] font-bold">세트 상품 만들기!</button>
              </div>
            </div>
            <div className="bg-black text-white rounded-[16px] p-6">
              <h3 className="font-bold text-[14px]">내 세트 상품 목록 - WMS에서 자동 피킹!</h3>
              <div className="mt-4 space-y-3">
                {bundles.map(b => (
                  <div key={b.id} className="bg-white text-black rounded-[12px] p-4"><p className="font-mono font-bold text-[11px] bg-black text-white px-2 py-0.5 rounded-full inline-block">{b.bundle_sku}</p><p className="font-bold text-[13px] mt-2">{b.bundle_name}</p><p className="text-[11px] opacity-60 mt-1">구성: {b.components.map(c=>`${c.product_name} x${c.qty}`).join(" + ")}</p><p className="font-bold text-[12px] mt-2">{b.price.toLocaleString()}원</p><p className="text-[10px] opacity-50 mt-1">WMS에서 이 세트 주문 들어오면 구성품 자동으로 피킹 리스트에 추가!</p></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="upload" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
            <h3 className="font-bold text-[16px]">플랫폼에 상품 업로드 - 사방넷 기능! (준비중)</h3>
            <p className="text-[12px] opacity-60 mt-2">내 상품을 네이버, 쿠팡, 11번가에 한 번에 등록! 사방넷처럼!</p>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="border border-green-200 bg-green-50 rounded-[12px] p-4"><p className="font-bold text-[13px] text-green-800">네이버 스마트스토어</p><p className="text-[11px] text-green-700 mt-2">카테고리, 원산지, 제조사, 옵션 필요<br/>API: POST /v2/products</p><button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-full text-[11px] font-bold w-full">네이버에 업로드 (준비중)</button></div>
              <div className="border border-red-200 bg-red-50 rounded-[12px] p-4"><p className="font-bold text-[13px] text-red-800">쿠팡 WING</p><p className="text-[11px] text-red-700 mt-2">카테고리, 브랜드, 키워드, 배송 템플릿 필요<br/>API: POST /v2/providers/openapi/products</p><button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-full text-[11px] font-bold w-full">쿠팡에 업로드 (준비중)</button></div>
              <div className="border border-blue-200 bg-blue-50 rounded-[12px] p-4"><p className="font-bold text-[13px] text-blue-800">11번가</p><p className="text-[11px] text-blue-700 mt-2">카테고리, 배송비 템플릿 필요<br/>API: 상품 등록</p><button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-full text-[11px] font-bold w-full">11번가에 업로드 (준비중)</button></div>
            </div>
            <div className="mt-6 bg-black text-white rounded-[12px] p-4"><p className="font-bold text-[12px]">사방넷처럼 일괄 업로드!</p><p className="text-[11px] opacity-60 mt-1">내 상품 10개 선택 → 네이버, 쿠팡, 11번가 체크 → 일괄 업로드 버튼 → 3개 플랫폼에 한 번에 등록! 재고도 자동 연동!</p><p className="text-[10px] opacity-40 mt-2">* 실제 업로드는 네이버, 쿠팡 API 계약 후 가능! 지금은 상품 마스터부터 완성!</p></div>
          </div>
        )}

        <div className="mt-8 bg-black text-white rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">Supabase products 테이블 만들기 (SQL)</h3>
          <div className="mt-3 bg-white/10 rounded-[8px] p-3 font-mono text-[11px] overflow-auto">
            <p>create table products (</p>
            <p className="ml-4">id uuid primary key default gen_random_uuid(),</p>
            <p className="ml-4">seller_id uuid references auth.users(id),</p>
            <p className="ml-4">sku text unique not null,</p>
            <p className="ml-4">barcode text,</p>
            <p className="ml-4">product_name text not null,</p>
            <p className="ml-4">category text,</p>
            <p className="ml-4">weight numeric,</p>
            <p className="ml-4">width int, height int, depth int,</p>
            <p className="ml-4">price int, stock int,</p>
            <p className="ml-4">location text,</p>
            <p className="ml-4">image_url text,</p>
            <p className="ml-4">created_at timestamp default now()</p>
            <p>);</p>
            <p className="mt-2">create table product_bundles (</p>
            <p className="ml-4">id uuid primary key default gen_random_uuid(),</p>
            <p className="ml-4">seller_id uuid,</p>
            <p className="ml-4">bundle_sku text unique,</p>
            <p className="ml-4">bundle_name text,</p>
            <p className="ml-4">components jsonb,</p>
            <p className="ml-4">price int</p>
            <p>);</p>
          </div>
        </div>
      </main>
    </div>
  );
}

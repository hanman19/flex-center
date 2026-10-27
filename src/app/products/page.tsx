"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TopNav from "@/components/TopNav";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sku, setSku] = useState(""); const [name, setName] = useState(""); const [barcode, setBarcode] = useState(""); const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
      if (data && data.length > 0) setProducts(data);
      else setProducts([
        { id: "1", sku: "EAR-001", product_name: "무선 이어폰", barcode: "880123456", weight: 150, location: "A-01-02", is_sample: false },
        { id: "2", sku: "SAMPLE-PC-01", product_name: "포토카드 랜덤", barcode: "", weight: 10, location: "S-01", is_sample: true },
      ]);
      setLoading(false);
    }; load();
  }, []);

  const addProduct = async () => {
    if (!sku || !name) { alert("SKU, 상품명 필수"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const newRow = { seller_id: user?.id, sku, product_name: name, barcode, weight: Number(weight)||0, location: "A-01-01", is_sample: false };
    setProducts([newRow as any, ...products]);
    try { await supabase.from("products").insert(newRow); } catch(e){}
    setSku(""); setName(""); setBarcode(""); setWeight("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <h1 className="text-[28px] font-black">상품 마스터</h1>
        <p className="text-[13px] opacity-60 mt-1">SKU, 바코드, 중량, 로케이션, 샘플 구분 - 모든 상품의 원장</p>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">신규 상품 등록</h3>
          <div className="mt-4 grid grid-cols-5 gap-3">
            <input value={sku} onChange={e=>setSku(e.target.value)} placeholder="SKU (EAR-001)" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" />
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="상품명" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" />
            <input value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="바코드" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" />
            <input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="중량(g)" className="border border-black/10 rounded-full px-4 py-2.5 text-[12px]" />
            <button onClick={addProduct} className="bg-black text-white rounded-full py-2.5 text-[12px] font-bold">+ 등록</button>
          </div>
          <p className="text-[10px] opacity-40 mt-3">* SKU는 플랫폼 SKU와 동일하게 입력해야 자동 매칭됨. 바코드 없으면 SKU로 피킹</p>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">SKU / 상품</th><th className="text-center">바코드</th><th className="text-center">중량</th><th className="text-center">위치</th><th className="text-center">구분</th></tr></thead>
            <tbody>{products.map(p=><tr key={p.id || p.sku} className="border-b border-black/[0.03]"><td className="py-4 px-6"><p className="font-bold">{p.product_name}</p><p className="font-mono text-[10px] opacity-50">{p.sku}</p></td><td className="text-center font-mono">{p.barcode || "-"}</td><td className="text-center">{p.weight}g</td><td className="text-center"><span className="bg-black text-white px-2 py-1 rounded-full text-[10px]">{p.location}</span></td><td className="text-center">{p.is_sample ? <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px]">샘플</span> : <span className="bg-gray-100 px-2 py-1 rounded-full text-[10px]">일반</span>}</td></tr>)}</tbody>
          </table>
        </div>

        <div className="mt-4 bg-black text-white rounded-[16px] p-5">
          <p className="text-[13px] font-bold">💡 상품 마스터가 왜 먼저냐?</p>
          <p className="text-[11px] opacity-60 mt-2">WMS, 주문, 송장, 세트상품 분해, 샘플 자동추가, 포토카드 랜덤 전부 이 테이블을 참조함. 여기서 SKU가 틀리면 전부 꼬임. 그래서 Phase 1로 상품 마스터를 먼저 만든 거!</p>
        </div>
      </main>
    </div>
  );
}

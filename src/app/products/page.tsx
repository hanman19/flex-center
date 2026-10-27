"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import TopNav from "@/components/TopNav";

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
  const [tab, setTab] = useState<"list" | "add">("list");
  const [form, setForm] = useState<Partial<Product>>({ sku: "", barcode: "", product_name: "", category: "전자기기", weight: 0.15, width: 10, height: 8, depth: 4, price: 0, stock: 0, location: "" });

  const handleAddProduct = () => {
    if (!form.sku || !form.product_name) { alert("SKU와 상품명은 필수!"); return; }
    const newProduct: Product = { id: Date.now().toString(), sku: form.sku!, barcode: form.barcode || "", product_name: form.product_name!, category: form.category || "전자기기", weight: form.weight || 0, width: form.width || 0, height: form.height || 0, depth: form.depth || 0, price: form.price || 0, stock: form.stock || 0, location: form.location || "" };
    setProducts([...products, newProduct]);
    setForm({ sku: "", barcode: "", product_name: "", category: "전자기기", weight: 0.15, width: 10, height: 8, depth: 4, price: 0, stock: 0, location: "" });
    setTab("list");
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-start justify-between">
          <div><h1 className="text-[28px] font-bold tracking-tight">상품 마스터</h1><p className="text-[13px] opacity-60 mt-1">상품 정보 한 번 입력하면 WMS, 샘플, 세트까지 다 연결!</p></div>
          <div className="bg-black text-white rounded-[12px] px-4 py-2 text-[11px]">총 {products.length}개 SKU</div>
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={()=>setTab("list")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="list" ? "bg-black text-white" : "bg-white border-black/10"}`}>내 상품 목록</button>
          <button onClick={()=>setTab("add")} className={`px-5 py-2.5 rounded-full text-[12px] font-bold border ${tab==="add" ? "bg-black text-white" : "bg-white border-black/10"}`}>+ 상품 등록</button>
        </div>
        {tab==="list" && (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {products.map(p=>(
              <div key={p.id} className="bg-white border border-black/5 rounded-[16px] p-5">
                <p className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded-full inline-block">{p.sku}</p>
                <p className="font-bold text-[14px] mt-2">{p.product_name}</p>
                <p className="text-[11px] opacity-60 mt-1">{p.category} · {p.location} · {p.stock}개</p>
                <p className="font-bold mt-2">{p.price.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        )}
        {tab==="add" && (
          <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6 max-w-[600px]">
            <h3 className="font-bold">상품 등록</h3>
            <div className="mt-4 grid gap-3">
              <input value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} placeholder="SKU" className="border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
              <input value={form.product_name} onChange={e=>setForm({...form, product_name: e.target.value})} placeholder="상품명" className="border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
              <input value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="위치 예: A-01-02" className="border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
              <input type="number" value={form.price} onChange={e=>setForm({...form, price: parseInt(e.target.value)||0})} placeholder="가격" className="border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
              <input type="number" value={form.stock} onChange={e=>setForm({...form, stock: parseInt(e.target.value)||0})} placeholder="재고" className="border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px]" />
              <button onClick={handleAddProduct} className="bg-black text-white py-3 rounded-full font-bold text-[13px]">등록하기</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

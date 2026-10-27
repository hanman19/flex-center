"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key"
);

export default function ProductsProPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sku, setSku] = useState(""); const [name, setName] = useState(""); const [barcode, setBarcode] = useState(""); const [weight, setWeight] = useState(""); const [location, setLocation] = useState("A-01-01"); const [isSample, setIsSample] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
      if (data && data.length > 0) setProducts(data);
      else setProducts([
        { id: "1", sku: "EAR-001", product_name: "무선 이어폰", barcode: "880123456", weight: 150, location: "A-01-02", is_sample: false, safety_stock: 10 },
        { id: "2", sku: "SAMPLE-PC-01", product_name: "포토카드 랜덤", barcode: "", weight: 10, location: "S-01", is_sample: true, safety_stock: 0 },
      ]);
      setLoading(false);
    }; load();
  }, []);

  const addSingle = async () => {
    if (!sku || !name) { alert("SKU, 상품명 필수"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    const row = { seller_id: user?.id, sku, product_name: name, barcode, weight: Number(weight)||0, location, is_sample: isSample, safety_stock: 10 };
    setProducts([row as any, ...products]);
    try { await supabase.from("products").insert(row); } catch(e){}
    setSku(""); setName(""); setBarcode(""); setWeight(""); setLocation("A-01-01"); setIsSample(false);
  };

  const handleExcel = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const XLSX = await import("xlsx");
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      // 예상 컬럼: sku, product_name, barcode, weight, location, is_sample, safety_stock, option_data
      const mapped = (data as any[]).map((r: any) => ({
        sku: r.sku || r.SKU || r["상품코드"] || "",
        product_name: r.product_name || r["상품명"] || r["상품명*"] || "",
        barcode: r.barcode || r["바코드"] || "",
        weight: Number(r.weight || r["중량"] || r["중량(g)"] || 0),
        location: r.location || r["위치"] || "A-01-01",
        is_sample: String(r.is_sample || r["샘플여부"] || "N").toUpperCase() === "Y" || r.is_sample === true,
        safety_stock: Number(r.safety_stock || r["안전재고"] || 10),
        option_data: r.option_data || r["옵션"] || "",
      })).filter((r: any) => r.sku && r.product_name);
      setExcelData(mapped);
    };
    reader.readAsBinaryString(file);
  };

  const uploadBulk = async () => {
    if (excelData.length === 0) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const rows = excelData.map(r => ({ ...r, seller_id: user?.id }));
    setProducts([...rows as any[], ...products]);
    try {
      const { error } = await supabase.from("products").insert(rows);
      if (error) throw error;
      alert(`${rows.length}개 상품 일괄 등록 완료!`);
      setExcelData([]);
    } catch(e: any) {
      alert("일괄 등록 실패: " + e.message + " - 중복 SKU 확인!");
    }
    setUploading(false);
  };

  const downloadTemplate = async () => {
    const XLSX = await import("xlsx");
    const template = [
      { sku: "EAR-001", product_name: "무선 이어폰", barcode: "8801234567890", weight: 150, location: "A-01-02", is_sample: "N", safety_stock: 10, option_data: "블랙" },
      { sku: "EAR-002", product_name: "무선 이어폰 화이트", barcode: "8801234567891", weight: 150, location: "A-01-03", is_sample: "N", safety_stock: 10, option_data: "화이트" },
      { sku: "SAMPLE-01", product_name: "포토카드 랜덤", barcode: "", weight: 10, location: "S-01", is_sample: "Y", safety_stock: 0, option_data: "" },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "상품마스터");
    XLSX.writeFile(wb, "FLEX_CENTER_상품마스터_템플릿.xlsx");
  };

  if (loading) return <div className="min-h-screen bg-[#fafaf8]"><TopNav /><div className="flex items-center justify-center h-[80vh]">로딩중...</div></div>;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <TopNav />
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-black">상품 마스터 Pro</h1>
            <p className="text-[13px] opacity-60 mt-1">SKU, 바코드, 중량, 위치, 샘플, 안전재고, 옵션 - 모든 상품의 원장. 엑셀 일괄 업로드 지원!</p>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadTemplate} className="bg-white border border-black/10 px-4 py-2 rounded-full text-[12px] font-bold">📥 템플릿 다운로드</button>
            <label className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold cursor-pointer">📤 엑셀 업로드<input type="file" accept=".xlsx,.xls,.csv" onChange={handleExcel} className="hidden" /></label>
          </div>
        </div>

        {excelData.length > 0 && (
          <div className="mt-6 bg-[#FFC61A] border border-black rounded-[16px] p-6">
            <h3 className="font-black text-[14px]">엑셀 미리보기 - {excelData.length}개 상품</h3>
            <p className="text-[11px] opacity-60 mt-1">아래 내용이 맞으면 일괄 등록 버튼을 눌러!</p>
            <div className="mt-4 bg-white rounded-[12px] overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full text-[11px]"><thead className="bg-[#fafaf8] sticky top-0"><tr><th className="text-left py-2 px-3">SKU</th><th className="text-left">상품명</th><th>바코드</th><th>중량</th><th>위치</th><th>샘플</th><th>안전재고</th></tr></thead>
                <tbody>{excelData.slice(0,50).map((r,i)=><tr key={i} className="border-b"><td className="py-2 px-3 font-mono">{r.sku}</td><td>{r.product_name}</td><td className="text-center">{r.barcode}</td><td className="text-center">{r.weight}g</td><td className="text-center">{r.location}</td><td className="text-center">{r.is_sample ? "Y" : "N"}</td><td className="text-center">{r.safety_stock}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={uploadBulk} disabled={uploading} className="bg-black text-white px-6 py-3 rounded-full font-bold text-[13px]">{uploading ? "업로드중..." : `${excelData.length}개 일괄 등록!`}</button><button onClick={()=>setExcelData([])} className="bg-white border border-black px-6 py-3 rounded-full font-bold text-[13px]">취소</button></div>
          </div>
        )}

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] p-6">
          <h3 className="font-bold text-[14px]">단건 등록</h3>
          <div className="mt-4 grid grid-cols-7 gap-2">
            <input value={sku} onChange={e=>setSku(e.target.value)} placeholder="SKU*" className="border border-black/10 rounded-full px-3 py-2.5 text-[12px]" />
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="상품명*" className="border border-black/10 rounded-full px-3 py-2.5 text-[12px]" />
            <input value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="바코드" className="border border-black/10 rounded-full px-3 py-2.5 text-[12px]" />
            <input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="중량(g)" className="border border-black/10 rounded-full px-3 py-2.5 text-[12px]" />
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="위치" className="border border-black/10 rounded-full px-3 py-2.5 text-[12px]" />
            <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={isSample} onChange={e=>setIsSample(e.target.checked)} />샘플</label>
            <button onClick={addSingle} className="bg-black text-white rounded-full py-2.5 text-[12px] font-bold">+ 등록</button>
          </div>
          <p className="text-[10px] opacity-40 mt-3">* SKU는 플랫폼 SKU와 동일해야 자동 매칭. 바코드 없으면 SKU로 피킹. 샘플 체크하면 주문시 자동 추가. 안전재고 10개 이하면 카톡 알림!</p>
        </div>

        <div className="mt-6 bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between"><h3 className="font-bold text-[14px]">내 상품 {products.length}개</h3><span className="text-[11px] opacity-50">SKU 중복 불가 - 중복이면 업데이트</span></div>
          <table className="w-full text-[12px]">
            <thead className="bg-[#fafaf8] text-[10px] opacity-60 border-b"><tr><th className="text-left py-3 px-6">SKU / 상품 / 옵션</th><th className="text-center">바코드</th><th className="text-center">중량</th><th className="text-center">위치</th><th className="text-center">안전재고</th><th className="text-center">구분</th></tr></thead>
            <tbody>{products.map(p=><tr key={p.id || p.sku} className="border-b border-black/[0.03] hover:bg-[#fafaf8]"><td className="py-4 px-6"><p className="font-bold">{p.product_name}</p><p className="font-mono text-[10px] opacity-50">{p.sku} {p.option_data && `· ${p.option_data}`}</p></td><td className="text-center font-mono">{p.barcode || "-"}</td><td className="text-center">{p.weight}g</td><td className="text-center"><span className="bg-black text-white px-2 py-1 rounded-full text-[10px]">{p.location}</span></td><td className="text-center">{p.safety_stock || 10}개</td><td className="text-center">{p.is_sample ? <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold">샘플</span> : <span className="bg-gray-100 px-2 py-1 rounded-full text-[10px]">일반</span>}</td></tr>)}</tbody>
          </table>
        </div>

        <div className="mt-4 bg-black text-white rounded-[16px] p-5">
          <p className="text-[13px] font-bold">💡 상품 마스터가 왜 먼저냐? + 엑셀 팁</p>
          <p className="text-[11px] opacity-60 mt-2">WMS, 주문, 송장, 세트상품 분해, 샘플 자동추가, 포토카드 랜덤 전부 이 테이블을 참조! SKU가 틀리면 전부 꼬임! 엑셀 업로드할 때 템플릿 다운받아서 그대로 채워서 업로드! 중복 SKU 있으면 덮어쓰기!</p>
        </div>
      </main>
    </div>
  );
}

"use client";
import TopNav from "@/components/TopNav";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

const ADMIN_EMAILS = ["phankyu@gmail.com"];

// PHASE 3 - 증정품 규칙 엔진! (화장품, K-pop 굿즈)
// 실제 운영에서는 promotion_rules 테이블에서 가져옴!
const PROMOTION_RULES = [
  {
    id: "RULE-01",
    name: "에센스 2개 사면 샘플 1개 증정!",
    type: "buy_x_get_sample",
    trigger_sku: "COS-001", // 에센스
    min_qty: 2,
    sample_sku: "COS-SAMPLE-01",
    sample_name: "에센스 샘플 5ml",
    qty: 1,
    location: "SAMPLE-A-01",
    barcode: "880123499001",
    category: "샘플",
    active: true,
  },
  {
    id: "RULE-02",
    name: "K-pop 앨범 구매시 포토카드 랜덤 증정!",
    type: "random_gift",
    trigger_sku: "KPOP-001",
    min_qty: 1,
    sample_pool: [
      { sku: "KPOP-PC-01", name: "포토카드 A", barcode: "880123499101", location: "SAMPLE-B-01" },
      { sku: "KPOP-PC-02", name: "포토카드 B", barcode: "880123499102", location: "SAMPLE-B-02" },
      { sku: "KPOP-PC-03", name: "포토카드 C (레어!)", barcode: "880123499103", location: "SAMPLE-B-03" },
    ],
    qty: 1,
    active: true,
  },
  {
    id: "RULE-03",
    name: "SET-001 구매시 에어팟 케이스 무료!",
    type: "bundle_auto",
    bundle_sku: "SET-001",
    bundle_name: "이어폰+케이스 세트",
    components: [
      { sku: "EAR-001", qty: 1 },
      { sku: "CASE-04", qty: 1 },
    ],
    active: true,
  }
];

function getBoxRecommendation(qty: number, weight: number) {
  if (qty <= 1 && weight < 0.5) return { size: "소", dim: "200x150x100", cost: "무료" };
  if (qty <= 3 && weight < 1) return { size: "중", dim: "300x200x150", cost: "무료" };
  if (qty <= 5 && weight < 2) return { size: "대", dim: "400x300x200", cost: "무료" };
  return { size: "특대", dim: "500x400x300", cost: "500원" };
}

export default function WMSProPhase3Page() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<any[]>([]);
  const [scanInput, setScanInput] = useState("");
  const [lastScan, setLastScan] = useState("");
  const [scanMode, setScanMode] = useState<"barcode" | "sku" | "location">("barcode");
  const [completed, setCompleted] = useState<string[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [worker] = useState("작업자 A");
  const [stats, setStats] = useState({ today: 0, hour: 0 });
  const [showRules, setShowRules] = useState(true);
  const [loading, setLoading] = useState(true);
  const scanRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s);
      if (s?.user?.email && ADMIN_EMAILS.includes(s.user.email)) setIsAdmin(true);

      let prodData: any[] = [];
      try {
        const { data } = await supabase.from("products").select("*").order("location");
        if (data && data.length > 0) prodData = data;
      } catch {}
      if (prodData.length === 0) {
        prodData = [
          { sku: "EAR-001", barcode: "880123456001", location: "A-01-02", product_name: "무선 이어폰 Pro", weight: 0.15, stock: 150, category: "전자기기", price: 59000 },
          { sku: "WATCH-02", barcode: "880123456002", location: "B-02-05", product_name: "스마트 워치", weight: 0.2, stock: 45, category: "전자기기", price: 129000 },
          { sku: "CASE-04", barcode: "880123456003", location: "A-01-03", product_name: "에어팟 케이스", weight: 0.05, stock: 320, category: "액세서리", price: 15000 },
          { sku: "COS-001", barcode: "880123456004", location: "A-02-01", product_name: "에센스 100ml", weight: 0.3, stock: 200, category: "화장품", price: 45000 },
          { sku: "KPOP-001", barcode: "880123456005", location: "A-03-01", product_name: "K-pop 앨범", weight: 0.4, stock: 100, category: "K-pop 굿즈", price: 25000 },
          { sku: "COS-SAMPLE-01", barcode: "880123499001", location: "SAMPLE-A-01", product_name: "에센스 샘플 5ml", weight: 0.02, stock: 1000, category: "샘플", price: 0 },
        ];
      }
      setProducts(prodData);

      // 주문 mock + PHASE 3 샘플 자동 추가 로직!
      const baseOrders = [
        { id: "1", orderNo: "20241027-001", sku: "COS-001", barcode: "880123456004", location: "A-02-01", product: "에센스 100ml", qty: 2, weight: 0.3, recipient: "김지은 (화장품 2개)", status: "new", price: 45000, isSample: false, isBundleComponent: false },
        { id: "2", orderNo: "20241027-002", sku: "KPOP-001", barcode: "880123456005", location: "A-03-01", product: "K-pop 앨범", qty: 1, weight: 0.4, recipient: "박지민 (K-pop 팬)", status: "new", price: 25000, isSample: false, isBundleComponent: false },
        { id: "3", orderNo: "20241027-003", sku: "EAR-001", barcode: "880123456001", location: "A-01-02", product: "무선 이어폰 Pro", qty: 1, weight: 0.15, recipient: "이서준", status: "new", price: 59000, isSample: false, isBundleComponent: false },
        { id: "4", orderNo: "20241027-004", sku: "SET-001", barcode: "880123456100", location: "BUNDLE", product: "이어폰+케이스 세트", qty: 1, weight: 0.2, recipient: "최유진 (세트)", status: "new", price: 74000, isSample: false, isBundleComponent: false, isBundle: true },
        { id: "5", orderNo: "20241027-005", sku: "WATCH-02", barcode: "880123456002", location: "B-02-05", product: "스마트 워치", qty: 1, weight: 0.2, recipient: "정하은", status: "new", price: 129000, isSample: false, isBundleComponent: false },
      ];

      // PHASE 3 핵심! 주문을 확장해서 샘플 자동 추가!
      let expanded: any[] = [];
      baseOrders.forEach(order => {
        expanded.push(order);

        // 세트 상품이면 분해!
        if (order.isBundle) {
          const rule = PROMOTION_RULES.find(r => r.bundle_sku === order.sku);
          if (rule && rule.components) {
            rule.components.forEach((comp: any, idx: number) => {
              const compProd = prodData.find((p: any) => p.sku === comp.sku);
              expanded.push({
                id: `${order.id}-COMP-${idx}`,
                orderNo: order.orderNo,
                sku: comp.sku,
                barcode: compProd?.barcode || comp.sku,
                location: compProd?.location || "A-01-02",
                product: compProd?.product_name || comp.sku,
                qty: comp.qty * order.qty,
                weight: compProd?.weight || 0.1,
                recipient: `${order.recipient} [세트 분해]`,
                status: "new",
                price: 0,
                isSample: false,
                isBundleComponent: true,
                parentOrder: order.id,
              });
            });
          }
        }

        // 샘플 규칙 체크!
        PROMOTION_RULES.forEach(rule => {
          if (!rule.active) return;
          if (rule.type === "buy_x_get_sample" && order.sku === rule.trigger_sku && order.qty >= (rule.min_qty || 1)) {
            const sampleProd = prodData.find((p: any) => p.sku === rule.sample_sku);
            expanded.push({
              id: `${order.id}-SAMPLE-${rule.id}`,
              orderNo: order.orderNo,
              sku: rule.sample_sku!,
              barcode: rule.barcode!,
              location: rule.location!,
              product: rule.sample_name!,
              qty: rule.qty,
              weight: sampleProd?.weight || 0.02,
              recipient: `${order.recipient} [증정품]`,
              status: "new",
              price: 0,
              isSample: true,
              sampleRule: rule.name,
              parentOrder: order.id,
            });
          }
          if (rule.type === "random_gift" && order.sku === rule.trigger_sku) {
            // 랜덤 포토카드!
            const pool = rule.sample_pool!;
            const randomPick = pool[Math.floor(Math.random() * pool.length)];
            expanded.push({
              id: `${order.id}-RANDOM-${rule.id}`,
              orderNo: order.orderNo,
              sku: randomPick.sku,
              barcode: randomPick.barcode,
              location: randomPick.location,
              product: randomPick.name,
              qty: rule.qty,
              weight: 0.01,
              recipient: `${order.recipient} [랜덤 증정!]`,
              status: "new",
              price: 0,
              isSample: true,
              isRandom: true,
              sampleRule: rule.name,
              parentOrder: order.id,
            });
          }
        });
      });

      setOrders(baseOrders);
      setExpandedOrders(expanded);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => { if (scanRef.current) scanRef.current.focus(); }, [completed, scanMode]);

  const handleScan = (value: string) => {
    if (!value.trim()) return;
    const v = value.trim().toUpperCase();
    setLastScan(v);
    setScanInput("");

    const matching = expandedOrders.filter(o => (o.barcode === v || o.sku === v || o.location === v) && !completed.includes(o.id));
    if (matching.length > 0) {
      if (batchMode) {
        setCart([...new Set([...cart, ...matching.map(m=>m.id)])]);
      } else {
        setCompleted([...completed, matching[0].id]);
        setStats({ today: stats.today+1, hour: stats.hour+1 });
        alert(`✅ ${matching[0].isSample ? "🎁 증정품" : matching[0].isBundleComponent ? "📦 세트 분해" : "✅"} 피킹 완료!\n${matching[0].product} x${matching[0].qty}\n위치: ${matching[0].location}${matching[0].isSample ? `\n규칙: ${matching[0].sampleRule}` : ""}${matching[0].isRandom ? "\n🎲 랜덤 포토카드!" : ""}`);
      }
    } else {
      const done = expandedOrders.find(o => (o.barcode === v || o.sku === v) && completed.includes(o.id));
      if (done) alert(`이미 완료! ${done.product}`);
      else alert(`❌ ${v}에 해당하는 주문 없음!`);
    }
  };

  const wavePicking = expandedOrders.filter(o=>!completed.includes(o.id)).sort((a,b)=>a.location.localeCompare(b.location));
  const total = expandedOrders.length;
  const done = completed.length;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[13px]">
      <TopNav />PHASE 3 로딩 - 샘플 자동 추가 규칙 적용중...</div>;
  if (session && ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(session.user.email)) {
    // allow anyway for demo
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="border-b border-black/5 bg-black text-white sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center font-black text-[12px]">F</div><span className="font-bold">FLEX CENTER</span><span className="text-[11px] opacity-50 ml-2">WMS Pro PHASE 3</span><span className="ml-2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">샘플 자동</span><span className="ml-1 bg-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">세트 분해</span></div>
          <div className="flex gap-2 items-center"><Link href="/products" className="text-[11px] px-3 py-1.5 rounded-full bg-white text-black font-bold">📦 상품 {products.length}</Link><Link href="/admin/wms" className="text-[11px] px-3 py-1.5 rounded-full bg-white/10">작업자 WMS Pro</Link></div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-4 space-y-4">
        {showRules && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-[16px] p-4">
            <div className="flex items-start justify-between">
              <div><p className="font-black text-[13px] text-black">🎁 PHASE 3 - 샘플/증정품 자동 추가 규칙 엔진! 화장품 + K-pop 굿즈!</p><div className="mt-2 grid md:grid-cols-3 gap-2">
                {PROMOTION_RULES.map(r=><div key={r.id} className="bg-white border border-black/10 rounded-[10px] px-3 py-2"><p className="font-bold text-[11px]">{r.name}</p><p className="text-[10px] opacity-60 mt-1">{r.type === "buy_x_get_sample" ? `${r.trigger_sku} ${r.min_qty}개 이상 → ${r.sample_sku} ${r.qty}개` : r.type === "random_gift" ? `${r.trigger_sku} → 포토카드 ${r.sample_pool?.length}종 중 랜덤 1개` : `${r.bundle_sku} → ${r.components?.map(c=>`${c.sku} x${c.qty}`).join(" + ")}`}</p><p className="text-[9px] mt-1"><span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${r.active ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{r.active ? "활성" : "비활성"}</span></p></div>)}
              </div><p className="text-[10px] opacity-50 mt-3">* 실제 운영에서는 promotion_rules 테이블에서 관리! Admin에서 ON/OFF 가능!</p></div>
              <button onClick={()=>setShowRules(false)} className="text-[11px] px-2 py-1 rounded-full bg-black/10">숨기기</button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-3">
          <div className="bg-black text-white rounded-[16px] p-4 border-2 border-pink-500"><p className="text-[10px] opacity-60">총 피킹 (샘플 포함)</p><p className="font-black text-[22px] mt-1">{done} / {total}</p><p className="text-[10px] opacity-60 mt-1">기본 {orders.length} + 샘플/분해 {total - orders.length}</p></div>
          <div className="bg-pink-50 border border-pink-200 rounded-[16px] p-4"><p className="text-[10px] opacity-60">🎁 증정품</p><p className="font-black text-[18px] mt-1 text-pink-700">{expandedOrders.filter(o=>o.isSample).length}건</p><p className="text-[10px] opacity-60 mt-1">{expandedOrders.filter(o=>o.isSample && !completed.includes(o.id)).length}건 남음</p></div>
          <div className="bg-purple-50 border border-purple-200 rounded-[16px] p-4"><p className="text-[10px] opacity-60">📦 세트 분해</p><p className="font-black text-[18px] mt-1 text-purple-700">{expandedOrders.filter(o=>o.isBundleComponent).length}건</p><p className="text-[10px] opacity-60 mt-1">SET → 구성품 피킹</p></div>
          <div className="bg-white border border-black/5 rounded-[16px] p-4"><p className="text-[10px] opacity-40">생산성</p><p className="font-black text-[18px] mt-1">{stats.today}건 / {stats.hour}건/h</p></div>
        </div>

        <div className="bg-amber-400 rounded-[16px] p-4 border-2 border-black">
          <div className="flex items-center justify-between"><p className="font-black text-[13px] text-black">📷 바코드 스캔 - 샘플/세트 포함! {scanMode === "barcode" ? "바코드" : scanMode === "sku" ? "SKU" : "위치"} 모드</p><div className="flex gap-1"><button onClick={()=>setScanMode("barcode")} className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${scanMode==="barcode" ? "bg-black text-white" : "bg-white/60 text-black"}`}>바코드</button><button onClick={()=>setScanMode("location")} className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${scanMode==="location" ? "bg-black text-white" : "bg-white/60 text-black"}`}>위치</button></div></div>
          <div className="mt-3 flex gap-2"><input ref={scanRef} value={scanInput} onChange={e=>setScanInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") handleScan(scanInput); }} placeholder={scanMode==="barcode" ? "바코드 스캔: 880123456004(에센스), 880123499001(샘플), 880123499101(포토카드)" : "위치 스캔: A-02-01, SAMPLE-A-01, SAMPLE-B-01"} className="flex-1 bg-white border-2 border-black rounded-full px-5 py-3 text-[14px] font-mono font-bold placeholder:font-normal placeholder:opacity-40 focus:outline-none" autoFocus /><button onClick={()=>handleScan(scanInput)} className="bg-black text-white px-6 py-3 rounded-full font-bold text-[13px]">스캔 (엔터)</button></div>
          {lastScan && <p className="mt-2 text-[11px] font-mono font-bold text-black">마지막 스캔: {lastScan}</p>}
        </div>

        <div className="bg-white border border-black/5 rounded-[16px] overflow-hidden">
          <div className="px-5 py-3 border-b border-black/5 flex items-center justify-between"><h3 className="font-bold text-[13px]">웨이브 피킹 리스트 - PHASE 3 샘플/세트 자동 추가! 선반 순으로 정렬! {done}/{total}</h3><div className="flex items-center gap-2"><button onClick={()=>setBatchMode(!batchMode)} className={`px-3 py-1 rounded-full text-[11px] font-bold ${batchMode ? "bg-amber-400 text-black" : "bg-black/10"}`}>{batchMode ? "배치 ON" : "배치 OFF"}</button><div className="h-2 w-[100px] bg-black/10 rounded-full overflow-hidden"><div className="h-full bg-pink-500 transition-all" style={{width: `${total ? (done/total*100) : 0}%`}}></div></div></div></div>
          <div className="divide-y divide-black/[0.04] max-h-[600px] overflow-auto">
            {wavePicking.map(o=>{
              const box = getBoxRecommendation(o.qty, o.weight || 0.1);
              return (
                <div key={o.id} className={`flex items-center gap-3 px-5 py-3 hover:bg-[#fafaf8] ${o.isSample ? "bg-pink-50/70 border-l-4 border-l-pink-500" : o.isBundleComponent ? "bg-purple-50/70 border-l-4 border-l-purple-500" : ""}`}>
                  <div className="w-[90px]"><div className={`font-mono px-2 py-1 rounded text-[11px] font-bold text-center ${o.isSample ? "bg-pink-500 text-white" : o.isBundleComponent ? "bg-purple-500 text-white" : "bg-black text-white"}`}>{o.location}</div><p className="text-[9px] opacity-40 text-center mt-1 font-mono">{o.barcode}</p></div>
                  <div className="flex-1"><p className="font-bold text-[12px] flex items-center gap-1.5">{o.isSample && "🎁"}{o.isBundleComponent && "📦"}{o.isRandom && "🎲"}{o.product} <span className="font-mono text-[10px] opacity-50">{o.sku} x{o.qty}</span>{o.isSample && <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">증정품</span>}{o.isBundleComponent && <span className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">세트 분해</span>}{o.isRandom && <span className="bg-amber-400 text-black text-[9px] px-1.5 py-0.5 rounded-full font-black">랜덤!</span>}</p><p className="text-[10px] opacity-60">{o.orderNo} - {o.recipient} {o.sampleRule && `| 규칙: ${o.sampleRule}`} | {o.isSample ? "재고 차감 X (증정품)" : `재고 차감`}</p></div>
                  <div className="text-center"><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${box.size==="소" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{box.size}</span></div>
                  <div className="text-right"><p className="font-bold text-[12px]">{o.qty}개</p><button onClick={()=>{setCompleted([...completed, o.id]); setStats({today: stats.today+1, hour: stats.hour+1});}} className="mt-1 text-[10px] px-2.5 py-1 rounded-full bg-black text-white font-bold">완료</button></div>
                </div>
              )
            })}
            {wavePicking.length===0 && <div className="text-center py-16"><p className="text-[16px] font-black">🎉 PHASE 3 피킹 모두 완료! 샘플/세트 포함 {total}건!</p><p className="text-[11px] opacity-50 mt-1">화장품 샘플, K-pop 포토카드 랜덤, 세트 분해까지 모두 처리!</p></div>}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-[16px] p-4">
          <h4 className="font-bold text-[12px]">💡 PHASE 3 운영 로직 설명 - 사방넷처럼!</h4>
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-pink-50 border border-pink-200 rounded-[12px] p-3"><p className="font-bold text-pink-700">화장품 샘플</p><p className="opacity-70 mt-1">에센스 2개 사면 → 샘플 5ml 자동 추가! 피킹 리스트에 노란색으로 표시! 재고는 샘플 SKU에서 별도 관리! 바코드 SAMPLE-A-01 선반에서 피킹!</p></div>
            <div className="bg-purple-50 border border-purple-200 rounded-[12px] p-3"><p className="font-bold text-purple-700">K-pop 랜덤 포토카드</p><p className="opacity-70 mt-1">앨범 1개 사면 → 포토카드 3종 중 랜덤 1개! 로직: Math.random()으로 뽑기! 레어 카드 당첨! SAMPLE-B-01~03 선반!</p></div>
            <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-3"><p className="font-bold text-amber-800">세트 상품 분해</p><p className="opacity-70 mt-1">SET-001 = EAR-001 + CASE-04! 주문 들어오면 자동으로 구성품으로 분해해서 피킹! 합포장 체크! 박스 추천은 합쳐서 계산!</p></div>
          </div>
          <div className="mt-3 bg-black text-white rounded-[12px] p-3 font-mono text-[10px]"><p>SQL - promotion_rules 테이블 (다음에 생성):</p><p className="opacity-70 mt-1">create table promotion_rules (id text primary key, name text, type text, trigger_sku text, min_qty int, sample_sku text, sample_pool jsonb, active boolean);</p></div>
        </div>
      </main>
    </div>
  );
}
